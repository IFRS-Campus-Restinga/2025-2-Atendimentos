import { useState, useEffect } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';

const Row = ({ label, children }) => (
    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 120, fontWeight: 600, color: '#34495e' }}>{label}</div>
        <div style={{ color: '#111827' }}>{children}</div>
    </div>
);

export default function DetalheEventoExtraordinario({
    isOpen,
    eventId,
    onClose,
    onEdit,
    turmaNameById,
    disciplinaNameById
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !eventId) return;

        async function load() {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await fetch(getApiUrl(`/services/evento-extraordinario/${eventId}/`), { headers });
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Erro ao carregar detalhes:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [eventId, isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
    };

    // Corrige deslocamento de timezone
    const formatDate = (d) => {
        if (!d) return "-";
        const dt = new Date(d + 'T00:00:00'); // força meia-noite local
        return dt.toLocaleDateString("pt-BR");
    };

    const formatTime = (t) => t ? t.slice(0, 5) : "-";

    // Nome correto da turma e disciplina
    const turmaNome = turmaNameById?.get?.(data?.turma) || data?.turma || "-";
    const disciplinaNome = disciplinaNameById?.get?.(data?.disciplina) || data?.disciplina || "-";

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Detalhes do Atendimento Extraordinário</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                {loading && <div>Carregando…</div>}

                {!loading && data && (
                    <div className="form-section-box">
                        <div className="form-section-title">Informações do Atendimento</div>

                        <Row label="Data">{formatDate(data.data_evento)}</Row>
                        <Row label="Horário">
                            {formatTime(data.hora_evento_inicio)}–{formatTime(data.hora_evento_fim)}
                        </Row>
                        <Row label="Turma">{turmaNome}</Row>
                        <Row label="Disciplina">{data.disciplina_nome || "-"}</Row>
                        <Row label="Cadastrado por">
                            {data.usuario_nome || data.usuario_create || "Não informado"}
                        </Row>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                            <button className="btn btn-secondary" onClick={onClose}>Voltar</button>

                            {onEdit && (
                                <button className="btn btn-primary" onClick={() => onEdit(data)}>
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
