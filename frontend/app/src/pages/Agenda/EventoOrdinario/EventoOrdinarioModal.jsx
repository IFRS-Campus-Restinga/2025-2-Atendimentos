import EventoOrdinarioForm from './EventoOrdinarioForm';
import EventoExtraordinarioForm from '../EventoExtraordinario/EventoExtraordinarioForm';
import '../Agenda.css';

const EventoOrdinarioModal = ({ isOpen, tipo, onClose, onSuccess }) => {
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
                    <h4>
                        {tipo === "ordinario"
                            ? "Cadastrar Atendimento de Turma"
                            : "Solicitar / Marcar Atendimento"}
                    </h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                {tipo === "ordinario" ? (
                    <EventoOrdinarioForm onSuccess={onSuccess || onClose} />
                ) : (
                    <EventoExtraordinarioForm onSuccess={onSuccess || onClose} />
                )}
            </div>
        </div>
    );
};

export default EventoOrdinarioModal;