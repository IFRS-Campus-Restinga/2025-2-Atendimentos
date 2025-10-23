import { useState, useEffect } from "react";

const EventoOrdinarioForm = ({ onSuccess }) => {
    const [diaSemana, setDiaSemana] = useState("");
    const [dataHora, setDataHora] = useState("");
    const [turma, setTurma] = useState("");
    const [limite, setLimite] = useState(25);
    const [status, setStatus] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/services/api/eventos-ordinarios/status-choices/")
            .then(res => res.json())
            .then(data => {
                setStatusOptions(data);
                if (data.length) setStatus(data[0].value); // valor inicial
            })
            .catch(err => console.error("Erro ao buscar status:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            dia_semana: diaSemana,
            data_hora: dataHora,
            turma,
            limite,
            status_atendimento: status
        };

        try {
            const res = await fetch("http://localhost:8000/services/evento-ordinario/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Evento cadastrado com sucesso!");
                // Resetar formulário
                setDiaSemana("");
                setDataHora("");
                setTurma("");
                setLimite(25);
                setStatus(statusOptions[0]?.value || "");
                onSuccess?.();
            } else {
                const err = await res.json();
                alert("Erro: " + JSON.stringify(err));
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao conectar com o servidor.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="mb-3">
                <label>Dia do Evento</label>
                <input
                    type="date"
                    className="form-control"
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label>Data e Hora</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={dataHora}
                    onChange={(e) => setDataHora(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label>Turma</label>
                <input
                    type="text"
                    className="form-control"
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Limite</label>
                <input
                    type="number"
                    className="form-control"
                    value={limite}
                    onChange={(e) => setLimite(e.target.value)}
                    min="1"
                />
            </div>

            <div className="mb-3">
                <label>Status</label>
                <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onSuccess}
                >
                    Fechar
                </button>
                <button type="submit" className="btn btn-success">
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default EventoOrdinarioForm;
