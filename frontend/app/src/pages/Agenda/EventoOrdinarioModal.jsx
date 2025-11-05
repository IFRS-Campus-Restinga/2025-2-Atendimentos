import EventoOrdinarioForm from './EventoOrdinarioForm';

const EventoOrdinarioModal = ({ isOpen, onClose, evento, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h4 className="modal-title">{evento?.id ? 'Editar Evento Ordinário' : 'Novo Evento Ordinário'}</h4>
                <EventoOrdinarioForm evento={evento} onSuccess={onSuccess} onClose={onClose} />
            </div>
        </div>
    );
};

export default EventoOrdinarioModal;
