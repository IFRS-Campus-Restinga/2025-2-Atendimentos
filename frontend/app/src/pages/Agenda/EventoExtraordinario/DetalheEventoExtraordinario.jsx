import { useState, useEffect } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';

const Row = ({ label, value }) => (
    <div className="detail-row">
        <span className="detail-label">{label}:</span>
        <span className="detail-value">{value || "-"} </span>
    </div>
);

const DetalheEventoExtraordinario = ({ isOpen, id, onClose, onEdit }) => {
    const [data, setData] = useState(null);

    // 🔥 1. HOOKS SEMPRE AQUI EM CIMA (antes de qualquer return)

    useEffect(() => {
        if (!isOpen || !id) {
            setData(null);
            return;
        }

        const auth = localStorage.getItem("authToken");
        const headers = auth ? { Authorization: `Bearer ${auth}` } : {};

        fetch(getApiUrl(`/services/evento-extraordinario/${id}/`), { headers })
            .then((res) => res.json())
            .then((json) => setData(json))
            .catch((err) => console.error("Erro ao carregar detalhes:", err));

    }, [id, isOpen]);

    // 🔥 2. Só depois disso você pode não renderizar o modal
    if (!isOpen) return null;
    if (!data) return null;

    const formatDate = (d) => new Date(d).toLocaleDateString("pt-BR");
    const formatTime = (t) => t?.slice(0, 5);

    return (
        <div
            className="modal-overlay"
            onClick={(e) =>
                e.target.classList.contains("modal-overlay") && onClose()
            }
        >
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Detalhes do Atendimento Extraordinário</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <Row label="Data" value={formatDate(data.data_evento)} />
                    <Row label="Horário de Início" value={formatTime(data.hora_evento_inicio)} />
                    <Row label="Horário de Término" value={formatTime(data.hora_evento_fim)} />
                    <Row label="Turma" value={data?.turma_nome} />
                    <Row label="Disciplina" value={data?.disciplina_nome} />
                    <Row label="Cadastrado por" value={data?.usuario_nome} />

                    <div className="detail-actions">
                        <button className="btn btn-secondary" onClick={onClose}>Fechar</button>

                        {onEdit && (
                            <button className="btn btn-primary" onClick={() => onEdit(data)}>
                                Editar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalheEventoExtraordinario;
