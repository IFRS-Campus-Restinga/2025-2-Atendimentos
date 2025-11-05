import './Agenda.css';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR'); // dd/mm/yyyy
};

const EventoVisualizacaoModal = ({ evento, isOpen, onClose, onEdit }) => {
    if (!isOpen || !evento) return null;

    const tipoClasse = evento.tipo?.toLowerCase() || 'ord';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h4 className={`modal-title ${tipoClasse}`}>
                    {evento.tipo === 'ORD' ? 'Evento Ordinário' : evento.tipo}
                </h4>

                <div className="modal-body">
                    <div className="mb-2"><strong>Turma:</strong> {evento.turma || '-'}</div>
                    <div className="mb-2"><strong>Data:</strong> {formatDate(evento.data_evento)}</div>
                    <div className="mb-2"><strong>Hora:</strong> {evento.data_hora_evento?.slice(0, 5)}</div>
                    <div className="mb-2"><strong>Status:</strong> {evento.status_atendimento}</div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
                    <button className="btn btn-success" onClick={() => onEdit(evento)}>Editar</button>
                </div>
            </div>
        </div>
    );
};

export default EventoVisualizacaoModal;
