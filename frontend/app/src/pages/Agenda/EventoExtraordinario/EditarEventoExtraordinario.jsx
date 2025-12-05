import { useEffect } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';
import EventoExtraordinarioBaseForm from './EventoExtraordinarioBaseForm';

export default function EditarEventoExtraordinario({ isOpen, onClose, evento, onSuccess }) {

    useEffect(() => {
        if (!isOpen || !evento) return;
    }, [isOpen, evento]);

    if (!isOpen || !evento) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) onClose?.();
    };

    const submitOverride = async (values) => {
        const url = getApiUrl(`/services/evento-extraordinario/${evento.id}/`);
        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(values),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Falha ao salvar');
        }

        return true;
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Editar Atendimento Extraordinário</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <EventoExtraordinarioBaseForm
                    isEditing={true}           // indica que é edição
                    defaultData={evento}       // inicializa os campos com os valores do evento
                    onSuccess={onSuccess}      // callback após salvar
                />
            </div>
        </div>
    );
}
