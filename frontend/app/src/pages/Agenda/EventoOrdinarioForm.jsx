import { useState, useEffect } from "react";

const EventoOrdinarioForm = ({ evento, onSuccess, onClose }) => {
    const [diaSemana, setDiaSemana] = useState(evento?.dia_semana || "SEG");
    const [hora, setHora] = useState(evento?.data_hora_evento || "");
    const [turma, setTurma] = useState(evento?.turma || "");
    const [limite, setLimite] = useState(evento?.limite || 25);
    const [status, setStatus] = useState(evento?.status_atendimento || "PEND");
    const [statusOptions, setStatusOptions] = useState([]);
    const [sending, setSending] = useState(false);

    // Nova opção: alterar apenas este evento ou toda a recorrência
    const [recorrencia, setRecorrencia] = useState("apenas");

    useEffect(() => {
        fetch("http://localhost:8000/services/api/eventos-ordinarios/status-choices/")
            .then(res => res.json())
            .then(data => {
                setStatusOptions(data);
                if (!evento) setStatus(data[0]?.value || "PEND");
            })
            .catch(err => console.error(err));
    }, [evento]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!diaSemana || !hora) {
            alert("Preencha Dia da semana e Horário.");
            return;
        }

        const payload = {
            dia_semana: diaSemana,
            data_hora_evento: hora,
            turma,
            limite,
            status_atendimento: status,
            recorrencia, // envio para backend decidir atualização
        };

        setSending(true);

        try {
            const method = evento?.id ? "PUT" : "POST";
            const url = evento?.id
                ? `http://localhost:8000/services/evento-ordinario/${evento.id}/`
                : "http://localhost:8000/services/evento-ordinario/";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(`Evento ${evento?.id ? "atualizado" : "criado"} com sucesso!`);
                onSuccess?.();
                onClose?.();
            } else {
                const errBody = await res.json().catch(() => null);
                console.error("Erro:", res, errBody);
                alert("Falha ao salvar evento.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro na requisição.");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="mb-3">
                <label>Dia da Semana</label>
                <select className="form-select" value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)}>
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
                <input type="time" className="form-control" value={hora} onChange={(e) => setHora(e.target.value)} required />
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
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            {evento?.id && (
                <div className="mb-3">
                    <label className="form-label">Alterar toda a recorrência?</label>
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="recorrenciaSim"
                                name="recorrencia"
                                value="todos"
                                checked={recorrencia === "todos"}
                                onChange={(e) => setRecorrencia(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="recorrenciaSim">Sim</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="recorrenciaNao"
                                name="recorrencia"
                                value="apenas"
                                checked={recorrencia === "apenas"}
                                onChange={(e) => setRecorrencia(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="recorrenciaNao">Não</label>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
                <button type="submit" className="btn btn-success" disabled={sending}>
                    {sending ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    );
};

export default EventoOrdinarioForm;
