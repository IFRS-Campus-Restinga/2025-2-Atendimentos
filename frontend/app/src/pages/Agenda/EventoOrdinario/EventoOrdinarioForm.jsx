import EventoOrdinarioBaseForm from './EventoOrdinarioBaseForm';

const EventoOrdinarioForm = ({ onSuccess }) => {
    // Usa o formulário base para manter o layout idêntico ao de edição.
    return (
        <EventoOrdinarioBaseForm
            mode="create"
            initialValues={{}}
            hideFields={{ diaSemana: false, dataFim: false }}
            onSuccess={onSuccess}
        />
    );
};

export default EventoOrdinarioForm;
