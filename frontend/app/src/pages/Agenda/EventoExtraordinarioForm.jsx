import { useState, useEffect } from "react";
import { getApiUrl } from "../../services/api";

const EventoExtraordinarioForm = ({ onSuccess }) => {
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [turmaId, setTurmaId] = useState("");
    const [disciplinaId, setDisciplinaId] = useState("");

    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Carregar turmas
        fetch(getApiUrl("turmas"))
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setTurmas(list);
            })
            .catch((err) => console.error("Erro ao buscar turmas:", err));

        // Carregar disciplinas
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

        if (!data || !horaInicio || !horaFim || !turmaId || !disciplinaId) {
            alert("Preencha Data, Horário de início, Horário de término, Turma e Disciplina.");
            return;
        }

        if (horaFim <= horaInicio) {
            alert("O horário de término deve ser maior que o de início.");
            return;
        }

        const payload = {
            data,                      // YYYY-MM-DD
            hora_evento_inicio: horaInicio,
            hora_evento_fim: horaFim,
            turma: Number(turmaId),
            disciplina: Number(disciplinaId),
        };

        setSending(true);

        try {
            const url = getApiUrl("/services/evento-extraordinario/");

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Atendimento extraordinário criado com sucesso!");

                // limpar
                setData("");
                setHoraInicio("");
                setHoraFim("");
                setTurmaId("");
                setDisciplinaId("");

                onSuccess?.();
            } else {
                const errorData = await res.json().catch(() => null);
                console.error("Erro ao criar extraordinário:", errorData);
                alert("Erro ao criar atendimento. Veja o console para mais detalhes.");
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
            alert("Erro de conexão com o servidor.");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">

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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
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

export default EventoExtraordinarioForm;
