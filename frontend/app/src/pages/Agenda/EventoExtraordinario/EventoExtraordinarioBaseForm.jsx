import { useState, useEffect } from "react";
import { getApiUrl } from "../../../services/api";

const EventoExtraordinarioBaseForm = ({
    onSuccess,
    defaultData = null,
    isEditing = false
}) => {

    const [data, setData] = useState(defaultData?.data_evento || "");
    const [horaInicio, setHoraInicio] = useState(defaultData?.hora_evento_inicio || "");
    const [horaFim, setHoraFim] = useState(defaultData?.hora_evento_fim || "");
    const [turmaId, setTurmaId] = useState(defaultData?.turma || "");
    const [disciplinaId, setDisciplinaId] = useState(defaultData?.disciplina || "");

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
        setDisciplinaId("");

        const url = turmaId
            ? getApiUrl(`disciplinas?turma=${turmaId}`)
            : getApiUrl("disciplinas");

        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        fetch(url, { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.results || [];
                setDisciplinaId("");
                setDisciplinas(list);
            })
            .catch((err) => console.error("Erro ao buscar disciplinas:", err));
    }, [turmaId]);

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
                method: method,
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

    return (
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
                <button type="submit" className="btn btn-success" disabled={sending}>
                    {sending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar"}
                </button>
            </div>
        </form>
    );
};

export default EventoExtraordinarioBaseForm;
