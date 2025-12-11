import { useState, useEffect } from "react";
import { getApiUrl } from "../../../services/api";
import RegistroAtendimentoModal from "../../RegistroAtendimento/RegistroAtendimentoModal";

const EventoExtraordinarioBaseForm = ({
    onSuccess,
    defaultData = null,
    isEditing = false
}) => {

    const [abrirRegistro, setAbrirRegistro] = useState(false);
    const [data, setData] = useState(defaultData?.data_evento || "");
    const [horaInicio, setHoraInicio] = useState(defaultData?.hora_evento_inicio || "");
    const [horaFim, setHoraFim] = useState(defaultData?.hora_evento_fim || "");
    const [turmaId, setTurmaId] = useState(defaultData?.turma || "");
    const [disciplinaId, setDisciplinaId] = useState(defaultData?.disciplina ? String(defaultData.disciplina) : "");

    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [sending, setSending] = useState(false);

    // ---------------------- CARREGAR TURMAS ----------------------
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        fetch(getApiUrl("turmas"), { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setTurmas(list);
            })
            .catch((err) => console.error("Erro ao buscar turmas:", err));
    }, []);

    // ---------------------- CARREGAR DISCIPLINAS ----------------------
    useEffect(() => {
        const url = getApiUrl("disciplinas");
        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        fetch(url, { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setDisciplinas(list);

                if (defaultData?.disciplina) {
                    setDisciplinaId(String(defaultData.disciplina));
                }
            })
            .catch((err) => console.error("Erro ao buscar disciplinas:", err));
    }, [defaultData]);

    // ---------------------- SALVAR / EDITAR ----------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data || !horaInicio || !horaFim || !turmaId || !disciplinaId) {
            alert("Preencha Data, Horário de início, Horário de término, Turma e Disciplina.");
            return;
        }

        if (horaFim <= horaInicio) {
            alert("O horário de término deve ser maior que o de início.");
            return;
        }

        const payload = {
            data_evento: data,
            hora_evento_inicio: horaInicio,
            hora_evento_fim: horaFim,
            turma: Number(turmaId),
            disciplina: Number(disciplinaId),
        };

        setSending(true);

        try {
            const authToken = localStorage.getItem("authToken");
            const authHeaders = authToken
                ? { Authorization: `Bearer ${authToken}` }
                : {};

            const url = isEditing
                ? getApiUrl(`/services/evento-extraordinario/${defaultData.id}/`)
                : getApiUrl("/services/evento-extraordinario/");

            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(
                    isEditing
                        ? "Evento extraordinário atualizado com sucesso!"
                        : "Atendimento extraordinário criado com sucesso!"
                );

                onSuccess?.();
            } else {
                const errorData = await res.json().catch(() => null);
                console.error("Erro:", errorData);
                alert("Erro ao salvar o evento.");
            }
        } catch (err) {
            console.error("Erro:", err);
            alert("Erro de conexão com o servidor.");
        } finally {
            setSending(false);
        }
    };

    // ---------------------- SALVAR REGISTRO DE ATENDIMENTO ----------------------
    const handleRegistroSuccess = async (registro) => {
        const token = localStorage.getItem("authToken");
        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        try {
            // 1) Cria o registro
            const regRes = await fetch(getApiUrl("/services/registro-atendimento/"), {
            method: "POST",
            headers,
            body: JSON.stringify(registro),
            });

            if (!regRes.ok) {
            const errBody = await regRes.text().catch(() => null);
            console.error("Falha ao criar registro:", regRes.status, errBody);
            throw new Error("Erro ao criar registro de atendimento");
            }

            // 2) Tenta descobrir o valor correto para 'concluído'
            let concludedValue = null;

            // 2.a) Tenta endpoints conhecidos de choices (ordem tentativa)
            const choicesEndpoints = [
            "/services/api/eventos-ordinarios/status-choices/",
            "/services/api/eventos-ordinarios/status_choices/",
            "/services/api/eventos-ordinario/status-choices/",
            "/services/api/eventos/status-choices/",
            "/services/api/evento-extraordinario/status-choices/",
            "/services/api/evento-extraordinario/status-choices/",
            ];

            for (const ep of choicesEndpoints) {
            try {
                const cRes = await fetch(getApiUrl(ep), { headers });
                if (!cRes.ok) continue;
                const cJson = await cRes.json().catch(() => null);
                if (!Array.isArray(cJson)) continue;

                // procura entrada cujo label ou value contenha 'concl'
                const found = cJson.find(item => {
                const v = String(item.value || "").toLowerCase();
                const l = String(item.label || item.display || "").toLowerCase();
                return v.includes("concl") || l.includes("concl") || v.includes("conc");
                });
                if (found) {
                concludedValue = found.value;
                break;
                }
            } catch (e) {
                /* ignora e tenta o próximo */
            }
            }

            // 2.b) Se não achou nas choices, tenta inferir por valores prováveis
            if (!concludedValue) {
            const fallbacks = ["CONCL", "CONC", "CONCLUIDO", "CONCLUÍDO", "CONCLUDED", "CLOSED", "FIN"];
            // tenta PATCH com cada fallback até obter 200/204
            for (const fb of fallbacks) {
                try {
                const updRes = await fetch(getApiUrl(`/services/evento-extraordinario/${defaultData?.id}/`), {
                    method: "PATCH",
                    headers,
                    body: JSON.stringify({ status_atendimento: fb }),
                });
                if (updRes.ok) {
                    concludedValue = fb;
                    break;
                }
                } catch (e) {
                // ignora erro e tenta próximo fallback
                }
            }
            } else {
            // 3) Se encontrou concludedValue via choices, faz o PATCH usando ele
            const updRes = await fetch(getApiUrl(`/services/evento-extraordinario/${defaultData?.id}/`), {
                method: "PATCH",
                headers,
                body: JSON.stringify({ status_atendimento: concludedValue }),
            });
            if (!updRes.ok) {
                const errBody = await updRes.text().catch(() => null);
                console.error("Erro ao atualizar evento (via concludedValue):", updRes.status, errBody);
                // não throw aqui; vamos tentar fallbacks abaixo
                concludedValue = null;
            }
            }

            // 4) Se ainda não tem concludedValue (não atualizado), tenta novamente com fallbacks (novamente)
            if (!concludedValue) {
            const fallbacks = ["CONCL", "CONC", "CONCLUIDO", "CONCLUÍDO", "CONCLUDED", "CLOSED", "FIN"];
            let ok = false;
            for (const fb of fallbacks) {
                try {
                const r = await fetch(getApiUrl(`/services/evento-extraordinario/${defaultData?.id}/`), {
                    method: "PATCH",
                    headers,
                    body: JSON.stringify({ status_atendimento: fb }),
                });
                if (r.ok) { ok = true; break; }
                const txt = await r.text().catch(() => null);
                console.warn(`Tentativa com fallback ${fb} retornou ${r.status}:`, txt);
                } catch (e) {
                console.warn("Erro ao tentar fallback", fb, e);
                }
            }
            if (!ok) {
                console.error("Não foi possível atualizar o status do evento. Verifique a API e as choices.");
                alert("Registro criado, mas não foi possível atualizar o status do evento (verifique console).");
                setAbrirRegistro(false);
                onSuccess?.();
                return;
            }
            }

            // 5) Se chegou até aqui, sucesso
            alert("Atendimento concluído e evento atualizado com sucesso!");
            setAbrirRegistro(false);
            onSuccess?.();
        } catch (err) {
            console.error("handleRegistroSuccess erro:", err);
            alert("Erro ao concluir atendimento. Veja o console para mais detalhes.");
        }
        };



    // ---------------------------------- RETURN ----------------------------------
    return (
        <>
            {/* Modal de Registro de Atendimento */}
            {abrirRegistro && (
                <RegistroAtendimentoModal
                    eventoId={defaultData?.id}
                    onClose={() => setAbrirRegistro(false)}
                    onSuccess={handleRegistroSuccess}
                />
            )}

            {/* Formulário principal */}
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-section-box">
                    <div className="form-section-title">Informações do Evento</div>

                    <div className="mb-3">
                        <label>Data do Atendimento</label>
                        <input
                            type="date"
                            className="form-control"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div>
                            <label>Início</label>
                            <input
                                type="time"
                                className="form-control"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Término</label>
                            <input
                                type="time"
                                className="form-control"
                                value={horaFim}
                                onChange={(e) => setHoraFim(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Turma</label>
                        <select
                            className="form-select"
                            value={turmaId}
                            onChange={(e) => setTurmaId(e.target.value)}
                            required
                        >
                            <option value="">Selecione a turma</option>
                            {turmas.map((t) => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Disciplina</label>
                        <select
                            className="form-select"
                            value={disciplinaId}
                            onChange={(e) => setDisciplinaId(e.target.value)}
                            required
                        >
                            <option value="">Selecione a disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={onSuccess}>
                        Fechar
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setAbrirRegistro(true)}
                        >
                            Concluir Atendimento
                        </button>
                    )}

                    <button type="submit" className="btn btn-success" disabled={sending}>
                        {sending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default EventoExtraordinarioBaseForm;
