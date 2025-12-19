import EventoOrdinarioBaseForm from './EventoOrdinarioBaseForm';
import '../Evento.css';

const CadastrarEventoOrdinario = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) onClose?.();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Cadastrar Atendimento de Turma</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <EventoOrdinarioBaseForm onSuccess={onSuccess || onClose} />
            </div>
        </div>
    );
};

export default CadastrarEventoOrdinario;
