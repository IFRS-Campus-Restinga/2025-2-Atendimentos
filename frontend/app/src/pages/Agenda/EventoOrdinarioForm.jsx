import { useState, useEffect } from "react";

const EventoOrdinarioForm = ({ onSuccess }) => {
    const [diaSemana, setDiaSemana] = useState("SEG");
    const [hora, setHora] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [turma, setTurma] = useState("");
    const [limite, setLimite] = useState(25);
    const [status, setStatus] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/services/api/eventos-ordinarios/status-choices/")
            .then((res) => res.json())
            .then((data) => {
                setStatusOptions(data);
                if (data.length) setStatus(data[0].value);
            })
            .catch((err) => {
                console.error("Erro ao buscar status:", err);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submit chamado", { diaSemana, hora, dataFim, turma, limite, status });

        if (!diaSemana || !hora || !dataFim) {
            alert("Preencha Dia da semana, Horário e Data final.");
            return;
        }

        const payload = {
            dia_semana: diaSemana,
            data_hora_evento: hora, // "HH:MM"
            data_fim: dataFim, // "YYYY-MM-DD"
            turma,
            limite,
            status_atendimento: status,
        };

        setSending(true);

        try {

            const urlsToTry = [
                "http://localhost:8000/services/evento-ordinario/",
                "http://localhost:8000/services/evento-ordinario/"
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
                // reset
                setHora("");
                setDataFim("");
                setTurma("");
                setLimite(25);
                setStatus(statusOptions[0]?.value || "");
                onSuccess?.();
            } else {
                // tenta pegar corpo do erro pra mostrar
                let errBody = null;
                try {
                    errBody = await (res && res.json ? res.json() : Promise.resolve(null));
                } catch (err) {
                    console.error("Erro ao parsear erro:", err);
                }
                console.error("Falha ao criar evento:", res, errBody);
                alert("Erro ao criar evento. Veja console (Network) para mais detalhes.");
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

            <div className="mb-3">
                <label>Horário</label>
                <input
                    type="time"
                    className="form-control"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                />
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
                <input type="text" className="form-control" value={turma} onChange={(e) => setTurma(e.target.value)} />
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
