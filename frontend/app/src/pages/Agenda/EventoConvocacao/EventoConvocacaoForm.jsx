import EventoConvocacaoBaseForm from './EventoConvocacaoBaseForm';

const EventoConvocacaoForm = ({ onSuccess }) => {
  return (
    <EventoConvocacaoBaseForm
      mode="create"
      initialValues={{}}
      onSuccess={onSuccess}
    />
  );
};

export default EventoConvocacaoForm;