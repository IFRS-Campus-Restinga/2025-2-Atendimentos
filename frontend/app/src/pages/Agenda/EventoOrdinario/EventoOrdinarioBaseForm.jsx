import { useState, useEffect } from "react";
import { getApiUrl } from "../../../services/api";

const EventoOrdinarioBaseForm = ({
    mode = 'create',
    initialValues,
    hideFields = {},
    onSuccess,
    onCancel,
    onSubmitOverride,
    extraFooter,
}) => {
    const [diaSemana, setDiaSemana] = useState("SEG");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [turmaId, setTurmaId] = useState("");
    const [disciplinaId, setDisciplinaId] = useState("");
    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [limite, setLimite] = useState(25);
    const [sala, setSala] = useState("");
    const [status, setStatus] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (mode !== 'edit' || !initialValues) return;
        if (typeof initialValues.dia_semana === 'string') setDiaSemana(initialValues.dia_semana);
        if (initialValues.hora_evento_inicio) setHoraInicio(String(initialValues.hora_evento_inicio).slice(0, 5));
        if (initialValues.hora_evento_fim) setHoraFim(String(initialValues.hora_evento_fim).slice(0, 5));
        if (initialValues.data_fim) setDataFim(String(initialValues.data_fim));
        if (initialValues.turma) setTurmaId(String(initialValues.turma));
        if (initialValues.disciplina) setDisciplinaId(String(initialValues.disciplina));
        if (typeof initialValues.limite !== 'undefined') setLimite(initialValues.limite);
        if (typeof initialValues.sala !== 'undefined' && initialValues.sala !== null) setSala(String(initialValues.sala));
        if (initialValues.status_atendimento) setStatus(initialValues.status_atendimento);
    }, [mode, initialValues]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        fetch(getApiUrl("/services/api/eventos-ordinarios/status-choices/"), { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                setStatusOptions(data);
                if (!status && data.length) setStatus(data[0].value);
            })
            .catch((err) => {
                console.error("Erro ao buscar status:", err);
            });

        fetch(getApiUrl("turmas"), { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setTurmas(list);
            })
            .catch((err) => console.error("Erro ao buscar turmas:", err));

        fetch(getApiUrl("disciplinas"), { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setDisciplinas(list);
            })
            .catch((err) => console.error("Erro ao buscar disciplinas:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const needsDiaSemana = !hideFields.diaSemana;
        const needsDataFim = !hideFields.dataFim;

        if ((needsDiaSemana && !diaSemana) || !horaInicio || !horaFim || (needsDataFim && !dataFim) || !turmaId || !disciplinaId) {
            alert("Preencha os campos obrigatórios: Dia/horários, Turma e Disciplina." + (needsDataFim ? " Inclua a Data final." : ""));
            return;
        }

        if (horaFim && horaInicio && horaFim <= horaInicio) {
            alert("O horário de término deve ser maior que o de início.");
            return;
        }

        // Validar duração máxima de 1 hora
        if (horaInicio && horaFim) {
            const [horaIni, minIni] = horaInicio.split(':').map(Number);
            const [horaFim2, minFim] = horaFim.split(':').map(Number);
            const duracaoMinutos = (horaFim2 * 60 + minFim) - (horaIni * 60 + minIni);

            if (duracaoMinutos > 60) {
                alert("Atendimentos ordinários podem ter no máximo 1 hora de duração.");
                return;
            }
        }

        const payload = {
            dia_semana: diaSemana,
            hora_evento_inicio: horaInicio,
            hora_evento_fim: horaFim,
            data_fim: dataFim,
            turma: Number(turmaId),
            disciplina: Number(disciplinaId),
            limite,
            sala: sala || null,
            status_atendimento: status,
        };

        setSending(true);
        try {
            if (typeof onSubmitOverride === 'function') {
                const result = await onSubmitOverride(payload);
                if (result !== false) {
                    onSuccess?.();
                }
                return;
            }

            const urlsToTry = [
                getApiUrl("/services/evento-ordinario/"),
                getApiUrl("/services/evento-ordinario/")
            ];

            const authToken = localStorage.getItem('authToken');
            const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

            let res = null;
            for (const url of urlsToTry) {
                res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(payload),
                });
                if (res.ok) break;
            }

            if (res && res.ok) {
                if (mode === 'create') {
                    setHoraInicio("");
                    setHoraFim("");
                    setDataFim("");
                    setTurmaId("");
                    setDisciplinaId("");
                    setLimite(25);
                    setStatus(statusOptions[0]?.value || "");
                }
                onSuccess?.();
            } else {
                let errBody = null;
                try {
                    errBody = await (res && res.json ? res.json() : Promise.resolve(null));
                } catch { }

                console.error("Falha ao criar evento:", res, errBody);

                if (errBody && errBody.detail) {
                    alert(errBody.detail);
                } else if (errBody && errBody.non_field_errors) {
                    alert(errBody.non_field_errors.join('\n'));
                } else {
                    alert("Erro ao criar evento. Verifique se não há conflito de horários.");
                }
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
            alert("Erro na requisição. Verifique se o backend está rodando e se CORS está ok.");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form" id="evento-form">
            {!hideFields.diaSemana && (
                <div className="form-section-box">
                    <div className="form-section-title">Dia da Semana</div>
                    <select className="form-select" value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)} required>
                        <option value="SEG">Segunda</option>
                        <option value="TER">Terça</option>
                        <option value="QUA">Quarta</option>
                        <option value="QUI">Quinta</option>
                        <option value="SEX">Sexta</option>
                        <option value="SAB">Sábado</option>
                    </select>
                </div>
            )}

            <div className="form-section-box">
                <div className="form-section-title">Horário</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                        <label>Início</label>
                        <input type="time" className="form-control" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
                    </div>
                    <div>
                        <label>Término</label>
                        <input type="time" className="form-control" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
                    </div>
                </div>
            </div>

            {!hideFields.dataFim && (
                <div className="form-section-box">
                    <div className="form-section-title">Recorrência</div>
                    <label>Repetir até</label>
                    <input type="date" className="form-control" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
                </div>
            )}

            <div className="form-section-box">
                <div className="form-section-title">Turma e Disciplina</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                        <label>Turma</label>
                        <select className="form-select" value={turmaId} onChange={(e) => setTurmaId(e.target.value)} required>
                            <option value="">Selecione a turma</option>
                            {turmas.map((t) => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Disciplina</label>
                        <select className="form-select" value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)} required>
                            <option value="">Selecione a disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section-box">
                <div className="form-section-title">Opções</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                        <label>Limite (opcional)</label>
                        <input type="number" className="form-control" value={limite} onChange={(e) => setLimite(e.target.value)} min="1" />
                    </div>
                    <div>
                        <label>Sala (opcional)</label>
                        <input type="text" className="form-control" value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Ex.: Sala 102" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 8 }}>
                    <div>
                        <label>Status</label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {extraFooter}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel || onSuccess}>Fechar</button>
                <button type="submit" className="btn btn-success" disabled={sending}>{sending ? "Salvando..." : (mode === 'edit' ? 'Salvar alterações' : 'Salvar')}</button>
            </div>
        </form>
    );
};

export default EventoOrdinarioBaseForm;
