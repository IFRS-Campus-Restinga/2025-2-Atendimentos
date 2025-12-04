import { useState, useEffect } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';

const EditarEventoExtraordinario = ({ isOpen, onClose, item, onSaved }) => {
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (item) {
            setData(item.data_evento || "");
            setHoraInicio(item.hora_evento_inicio || "");
            setHoraFim(item.hora_evento_fim || "");
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (horaFim <= horaInicio) {
            alert("O horário final deve ser maior que o inicial.");
            return;
        }

        const payload = {
            data_evento: data,
            hora_evento_inicio: horaInicio,
            hora_evento_fim: horaFim,
        };

        setSending(true);

        try {
            const url = getApiUrl(`/services/evento-extraordinario/${item.id}/`);
            const auth = localStorage.getItem("authToken");
            const headers = auth ? { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" } : {};

            const res = await fetch(url, {
                method: "PATCH",
                headers,
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                alert("Erro ao editar o atendimento.");
                return;
            }

            alert("Atendimento extraordinário atualizado!");
            onSaved?.();
            onClose?.();

        } catch (err) {
            console.error("Erro na edição:", err);
            alert("Erro no servidor.");
        } finally {
            setSending(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Editar Atendimento Extraordinário</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">

                    <div className="form-section-box">
                        <div className="form-section-title">Informações</div>

                        <div className="mb-3">
                            <label>Data</label>
                            <input type="date" className="form-control" value={data} onChange={e => setData(e.target.value)} required />
                        </div>

                        <div className="mb-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div>
                                <label>Início</label>
                                <input type="time" className="form-control" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required />
                            </div>
                            <div>
                                <label>Término</label>
                                <input type="time" className="form-control" value={horaFim} onChange={e => setHoraFim(e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-success" disabled={sending}>
                                {sending ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditarEventoExtraordinario;
