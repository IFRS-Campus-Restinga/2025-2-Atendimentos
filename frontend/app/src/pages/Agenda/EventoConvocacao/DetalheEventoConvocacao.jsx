import { useEffect, useState } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
    <div style={{ width: 120, fontWeight: 600, color: '#34495e' }}>{label}</div>
    <div style={{ color: '#111827' }}>{children}</div>
  </div>
);

export default function DetalheEventoConvocacao({ isOpen, onClose, onEdit, eventId, fallbackEvento, cursoNameById, disciplinaNameById, alunoNameById }) {
  const [loading, setLoading] = useState(false);
  const [evento, setEvento] = useState(fallbackEvento || null);

  useEffect(() => {
    if (!isOpen || !eventId) return;
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(getApiUrl(`/services/evento-convocacao/${eventId}/`), { headers });
        const data = await res.json();
        if (active) setEvento(data);
      } catch (e) {
        console.error('Erro ao carregar convocação:', e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [isOpen, eventId]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) onClose?.();
  };

  const cursoNome = evento ? (cursoNameById.get?.(evento.curso) || 'Curso') : '';
  const discNome = evento ? (disciplinaNameById.get?.(evento.disciplina) || 'Disciplina') : '';
  const alunoNome = evento ? (alunoNameById.get?.(evento.aluno) || 'Aluno') : '';
  const inicio = (evento?.hora_evento_inicio || '').slice(0, 5);
  const fim = (evento?.hora_evento_fim || '').slice(0, 5);
  const horario = fim ? `${inicio}–${fim}` : inicio;
  const cadastradoPor = evento?.usuario_create?.name || evento?.usuario_create?.username || 'Não informado';
  const dataStr = (() => {
    const s = evento?.data_evento;
    if (!s) return '';
    const [y, m, d] = String(s).split('-');
    if (!y || !m || !d) return s;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  })();

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Detalhes da Convocação</h4>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {loading && <div>Carregando…</div>}
        {!loading && evento && (
          <div className="form-section-box">
            <div className="form-section-title">Informações da Convocação</div>
            <Row label="Data">{dataStr}</Row>
            <Row label="Horário">{horario}</Row>
            <Row label="Curso">{cursoNome}</Row>
            <Row label="Disciplina">{discNome}</Row>
            <Row label="Aluno">{alunoNome}</Row>
            <Row label="Mensagem">{evento?.mensagem || 'Não informado'}</Row>
            <Row label="Sala">{evento?.sala ? evento.sala : 'Não informado'}</Row>
            {evento.status_atendimento && (
              <Row label="Status">{evento.status_atendimento}</Row>
            )}
            {typeof evento.limite !== 'undefined' && (
              <Row label="Limite">{evento.limite}</Row>
            )}
            <Row label="Cadastrado por">{cadastradoPor}</Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={onClose}>Voltar</button>
              {(evento?.can_change || evento?.can_reagendar || evento?.can_cancel) && (
                <button
                  className="btn btn-primary"
                  onClick={() => onEdit?.(evento)}
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}