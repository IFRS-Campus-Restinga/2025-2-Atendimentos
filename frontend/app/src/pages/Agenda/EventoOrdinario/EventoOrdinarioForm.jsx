import { useState, useEffect } from "react";
import { getApiUrl } from "../../../services/api";

const EventoOrdinarioForm = ({ onSuccess }) => {
    const [diaSemana, setDiaSemana] = useState("SEG");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [turmaId, setTurmaId] = useState("");
    const [disciplinaId, setDisciplinaId] = useState("");
    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [limite, setLimite] = useState(25);
    const [status, setStatus] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Status choices
        fetch(getApiUrl("/services/api/eventos-ordinarios/status-choices/"))
            .then((res) => res.json())
            .then((data) => {
                setStatusOptions(data);
                if (data.length) setStatus(data[0].value);
            })
            .catch((err) => {
                console.error("Erro ao buscar status:", err);
            });

        // Turmas
        fetch(getApiUrl("turmas"))
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setTurmas(list);
            })
            .catch((err) => console.error("Erro ao buscar turmas:", err));

        // Disciplinas
        fetch(getApiUrl("disciplinas"))
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setDisciplinas(list);
            })
            .catch((err) => console.error("Erro ao buscar disciplinas:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submit chamado", { diaSemana, horaInicio, horaFim, dataFim, turmaId, disciplinaId, limite, status });

        if (!diaSemana || !horaInicio || !horaFim || !dataFim || !turmaId || !disciplinaId) {
            alert("Preencha Dia da semana, Horário início, Horário término, Data final, Turma e Disciplina.");
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
            hora_evento_inicio: horaInicio, // "HH:MM"
            hora_evento_fim: horaFim,
            data_fim: dataFim, // "YYYY-MM-DD"
            turma: Number(turmaId),
            disciplina: Number(disciplinaId),
            limite,
            status_atendimento: status,
        };

        setSending(true);

        try {

            const urlsToTry = [
                getApiUrl("/services/evento-ordinario/"),
                getApiUrl("/services/evento-ordinario/")
            ];

            let res = null;
            for (const url of urlsToTry) {
                console.log("Tentando POST em", url);
                res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                console.log("Resposta status:", res.status, "url:", url);

                // sucesso
                if (res.ok) break;
            }

            if (res && res.ok) {

                const data = await res.json().catch(() => null);
                console.log("Evento(s) criado(s):", data);
                alert("Evento(s) criado(s) com sucesso!");
                setHoraInicio("");
                setHoraFim("");
                setDataFim("");
                setTurmaId("");
                setDisciplinaId("");
                setLimite(25);
                setStatus(statusOptions[0]?.value || "");
                onSuccess?.();
            } else {
                let errBody = null;
                try {
                    errBody = await (res && res.json ? res.json() : Promise.resolve(null));
                } catch (err) {
                    console.error("Erro ao parsear erro:", err);
                }
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
            <div className="mb-3">
                <label>Dia da Semana</label>
                <select
                    className="form-select"
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    required
                >
                    <option value="SEG">Segunda</option>
                    <option value="TER">Terça</option>
                    <option value="QUA">Quarta</option>
                    <option value="QUI">Quinta</option>
                    <option value="SEX">Sexta</option>
                    <option value="SAB">Sábado</option>
                </select>
            </div>

            <div className="mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
                    />
                </div>
            </div>

            <div className="mb-3">
                <label>Repetir até</label>
                <input
                    type="date"
                    className="form-control"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    required
                />
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
                        <option key={t.id} value={t.id}>
                            {t.nome}
                        </option>
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
                        <option key={d.id} value={d.id}>
                            {d.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label>Limite</label>
                <input type="number" className="form-control" value={limite} onChange={(e) => setLimite(e.target.value)} min="1" />
            </div>

            <div className="mb-3">
                <label>Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={onSuccess}>
                    Fechar
                </button>
                <button type="submit" className="btn btn-success" disabled={sending}>
                    {sending ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    );
};

export default EventoOrdinarioForm;
