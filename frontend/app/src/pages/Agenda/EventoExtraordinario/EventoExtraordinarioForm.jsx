import EventoExtraordinarioBaseForm from './EventoExtraordinarioBaseForm';

const EventoExtraordinarioForm = ({ onSuccess }) => {
    return (
        <EventoExtraordinarioBaseForm
            mode="create"
            initialValues={{}}
            // Extraordinário não tem dia da semana nem data fim
            hideFields={{ diaSemana: true, dataFim: true }}
            onSuccess={onSuccess}
        />
    );
};

export default EventoExtraordinarioForm;
