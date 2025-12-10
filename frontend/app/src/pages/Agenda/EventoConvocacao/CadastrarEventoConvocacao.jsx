import EventoConvocacaoBaseForm from './EventoConvocacaoBaseForm';
import '../Evento.css';

const CadastrarEventoConvocacao = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Cadastrar Convocação</h4>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <EventoConvocacaoBaseForm onSuccess={onSuccess || onClose} />
      </div>
    </div>
  );
};

export default CadastrarEventoConvocacao;