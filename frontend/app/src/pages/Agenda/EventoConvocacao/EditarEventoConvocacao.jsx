import { useEffect } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';
import EventoConvocacaoBaseForm from './EventoConvocacaoBaseForm';

export default function EditarEventoConvocacao({ isOpen, onClose, evento, turmas, disciplinas, alunos, onSuccess }) {
  useEffect(() => {
    // qualquer lógica extra de inicialização pode ir aqui
  }, [isOpen, evento]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) onClose?.();
  };

  const submitOverride = async (values) => {
    const url = getApiUrl(`/api/evento-convocacao/${evento.id}/editar/`);
    const method = 'PATCH';
    const body = {
      data_evento: values.data_evento,
      hora_evento_inicio: values.hora_evento_inicio,
      hora_evento_fim: values.hora_evento_fim,
      turma: Number(values.turma),
      disciplina: Number(values.disciplina),
      aluno: Number(values.aluno),
      mensagem: values.mensagem,
      limite: values.limite,
      sala: values.sala || null,
      status_atendimento: values.status_atendimento,
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Falha ao salvar convocação');
    }
    return true;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Editar Convocação de Atendimento</h4>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <EventoConvocacaoBaseForm
          mode="edit"
          initialValues={{
            data_evento: evento?.data_evento,
            hora_evento_inicio: evento?.hora_evento_inicio,
            hora_evento_fim: evento?.hora_evento_fim,
            turma: evento?.turma,
            disciplina: evento?.disciplina,
            aluno: evento?.aluno,
            mensagem: evento?.mensagem,
            limite: evento?.limite,
            sala: evento?.sala,
            status_atendimento: evento?.status_atendimento,
          }}
          onCancel={onClose}
          onSuccess={onSuccess}
          onSubmitOverride={submitOverride}
        />
      </div>
    </div>
  );
}