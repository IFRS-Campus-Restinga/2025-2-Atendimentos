import EventoOrdinarioForm from './EventoOrdinarioForm';
import './Agenda.css';

const EventoOrdinarioModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h4>Cadastrar Evento Ordinário</h4>
                <EventoOrdinarioForm onSuccess={onClose} />
            </div>
        </div>
    );
};

export default EventoOrdinarioModal;
