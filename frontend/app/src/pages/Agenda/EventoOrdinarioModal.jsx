import EventoOrdinarioForm from './EventoOrdinarioForm';
import './Agenda.css';

const EventoOrdinarioModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Cadastrar Atendimento de Turma</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <EventoOrdinarioForm onSuccess={onClose} />
            </div>
        </div>
    );
};

export default EventoOrdinarioModal;