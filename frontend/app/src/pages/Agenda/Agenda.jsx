import { useState, useEffect, useMemo, useCallback } from 'react';
import './Agenda.css';
import EventoOrdinarioModal from './EventoOrdinario/EventoOrdinarioModal';
import DetalheEventoOrdinario from './EventoOrdinario/DetalheEventoOrdinario';
import EditarEventoOrdinario from './EventoOrdinario/EditarEventoOrdinario';
import DetalheEventoExtraordinario from './EventoExtraordinario/DetalheEventoExtraordinario';
import EditarEventoExtraordinario from './EventoExtraordinario/EditarEventoExtraordinario';
import DetalheEventoConvocacao from './EventoConvocacao/DetalheEventoConvocacao';
import EditarEventoConvocacao from './EventoConvocacao/EditarEventoConvocacao';
import { getApiUrl } from '../../services/api';

// Period definitions
const PERIODS = [
  { key: 'MANHA', label: 'Manhã', start: 8 * 60, end: 12 * 60 + 59 },
  { key: 'TARDE', label: 'Tarde', start: 13 * 60, end: 17 * 60 + 59 },
  { key: 'NOITE', label: 'Noite', start: 18 * 60, end: 22 * 60 + 30 }
];

function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

function classifyPeriod(ev) {
  const start = ev.hora_evento_inicio;
  const minutes = timeToMinutes(start);
  const found = PERIODS.find(p => minutes >= p.start && minutes <= p.end);
  if (found) return found.key;
  if (minutes < PERIODS[0].start) return PERIODS[0].key;
  if (minutes > PERIODS[PERIODS.length - 1].end) return PERIODS[PERIODS.length - 1].key;
  return 'TARDE';
}

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [turmaFilter, setTurmaFilter] = useState(() => {
    try { return localStorage.getItem('agendaTurmaId') || ''; } catch { return ''; }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditExtraModal, setShowEditExtraModal] = useState(false);
  const [showDetailExtraModal, setShowDetailExtraModal] = useState(false);
  const [showDetailConvocacaoModal, setShowDetailConvocacaoModal] = useState(false);
  const [showEditConvocacaoModal, setShowEditConvocacaoModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const reloadEventos = useCallback(async (overrideTurmaId) => {
    try {
      const tId = overrideTurmaId ?? turmaFilter;
      const q = tId ? `?turma=${encodeURIComponent(tId)}` : '';
      const authToken = localStorage.getItem('authToken');
      const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const [ordRes, extraRes, convRes, baseRes] = await Promise.all([
        fetch(getApiUrl(`/services/evento-ordinario/${q}`), { headers: authHeaders }),
        fetch(getApiUrl(`/services/evento-extraordinario/${q}`), { headers: authHeaders }),
        fetch(getApiUrl(`/services/evento-convocacao/${q}`), { headers: authHeaders }),
        fetch(getApiUrl(`/services/eventos/${q}`), { headers: authHeaders })
      ]);
      const ordJson = await ordRes.json().catch(() => []);
      const extraJson = await extraRes.json().catch(() => []);
      const convJson = await convRes.json().catch(() => []);
      const baseJson = await baseRes.json().catch(() => []);
      const ordList = Array.isArray(ordJson) ? ordJson : ordJson?.results || [];
      const extraList = Array.isArray(extraJson) ? extraJson : extraJson?.results || [];
      const convList = Array.isArray(convJson) ? convJson : convJson?.results || [];
      const baseList = Array.isArray(baseJson) ? baseJson : baseJson?.results || [];
      const mergedRaw = [...ordList, ...extraList, ...convList, ...baseList];
      const unique = new Map();
      mergedRaw.forEach(ev => { if (!unique.has(ev.id)) unique.set(ev.id, ev); });
      // const mergedUnique = Array.from(unique.values());
      // const clientFiltered = tId ? mergedUnique.filter(ev => String(ev.turma) === String(tId)) : mergedUnique;
      // setEventos(clientFiltered);
      const mergedUnique = Array.from(unique.values());

      // 1️⃣ Filtrar pela turma (se existir)
      let clientFiltered = tId
        ? mergedUnique.filter(ev => String(ev.turma) === String(tId))
        : mergedUnique;

      // 2️⃣ Filtrar para remover concluídos
      clientFiltered = clientFiltered.filter(ev => {
        return (ev.status_atendimento || "").toUpperCase() !== "CONCL";
      });

      setEventos(clientFiltered);
    } catch (e) {
      console.error('Erro eventos:', e);
    }
  }, [turmaFilter]);

  useEffect(() => {
    if (turmaFilter) reloadEventos(turmaFilter);
    (async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const tRes = await fetch(getApiUrl('turmas'), { headers: authHeaders });
        const tJson = await tRes.json();
        setTurmas(Array.isArray(tJson) ? tJson : tJson?.results || []);
      } catch (e) { console.error('Erro turmas:', e); }

      try {
        const dRes = await fetch(getApiUrl('disciplinas'), { headers: authHeaders });
        const dJson = await dRes.json();
        setDisciplinas(Array.isArray(dJson) ? dJson : dJson?.results || []);
      } catch (e) { console.error('Erro disciplinas:', e); }

      try {
        const pRes = await fetch(getApiUrl('/services/api/permissions/'), { headers: authHeaders });
        if (pRes.ok) {
          const pJson = await pRes.json();
          setPermissions(pJson || {});
        }
      } catch (e) { console.error('Erro buscando permissões:', e); }
    })();
  }, [reloadEventos, turmaFilter]);

  const turmaNameById = useMemo(() => {
    const m = new Map();
    turmas.forEach(t => m.set(t.id, t.nome));
    return m;
  }, [turmas]);

  const disciplinaNameById = useMemo(() => {
    const m = new Map();
    disciplinas.forEach(d => m.set(d.id, d.nome));
    return m;
  }, [disciplinas]);

  const getWeekDays = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + offset);
    const days = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  function getDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const grouped = useMemo(() => {
    const map = {};
    eventos.forEach(ev => {
      const dateKey = ev.data_evento;
      const periodKey = classifyPeriod(ev);
      if (!map[dateKey]) map[dateKey] = { MANHA: [], TARDE: [], NOITE: [], OUTRO: [] };
      if (!map[dateKey][periodKey]) map[dateKey][periodKey] = [];
      map[dateKey][periodKey].push(ev);
    });
    return map;
  }, [eventos]);

  const getEventosForDatePeriod = (date, periodKey) => {
    const dateStr = getDateStr(date);
    return grouped[dateStr]?.[periodKey] || [];
  };

  const weekDays = getWeekDays(currentDate);

   return (
    <div className="agenda-wrapper">
      <div className="agenda-container">
        <div className="agenda-header">
          <h2>Agenda Semanal</h2>
          <p className="text-muted">Eventos (ordinários, extraordinários e convocações)</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
          {permissions.can_create_ordinario !== false && (
            <button className="btn btn-success"
              onClick={() => { setModalTipo("ordinario"); setIsModalOpen(true); }}
              disabled={!turmaFilter}>
              + Novo Atendimento de Turma
            </button>
          )}
          {permissions.can_create_extraordinario !== false && (
            <button className="btn btn-success" style={{ marginLeft: '8px' }}
              onClick={() => { setModalTipo("extraordinario"); setIsModalOpen(true); }}
              disabled={!turmaFilter}>
              Solicitar / Marcar Atendimento
            </button>
          )}

          {permissions.can_create_convocacao !== false && (
            <button className="btn btn-success" style={{ marginLeft: '8px' }}
              onClick={() => { setModalTipo("convocacao"); setIsModalOpen(true); }}
              disabled={!turmaFilter}>
              + Nova Convocação
            </button>
          )}
        
        </div>

        <div className="mb-3" style={{ maxWidth: 360 }}>
          <label className="form-label fw-semibold mb-1">Turma</label>
          <select
            className="form-select form-select-sm"
            value={turmaFilter}
            onChange={(e) => {
              const v = e.target.value;
              setTurmaFilter(v);
              try { localStorage.setItem('agendaTurmaId', v); } catch { }
              if (v) { reloadEventos(v); } else { setEventos([]); }
            }}
            required
          >
            <option value="" disabled>Selecione a turma</option>
            {turmas.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div className="legenda-eventos mb-3">
          <div className="legenda-item">
            <span className="legenda-cor evento-ordinario"></span>
            <span>Atendimento de Turma</span>
          </div>
          <div className="legenda-item">
            <span className="legenda-cor evento-extraordinario"></span>
            <span>Atendimento Extra</span>
          </div>
          <div className="legenda-item">
            <span className="legenda-cor evento-convocacao"></span>
            <span>Convocação</span>
          </div>
        </div>

        <div className="weekly-calendar">
          <div className="calendar-header">
            <button className="btn btn-outline-secondary" onClick={() => navigateWeek(-1)}>← Semana Anterior</button>
            <h3 className="month-year">
              {weekDays[0].toLocaleDateString()} - {weekDays[5].toLocaleDateString()}
            </h3>
            <button className="btn btn-outline-secondary" onClick={() => navigateWeek(1)}>Próxima Semana →</button>
          </div>

          {!turmaFilter ? (
            <div className="alert alert-warning" role="alert">Selecione uma turma para visualizar a agenda.</div>
          ) : (
            <div className="calendar-grid periods-grid">
              <div className="period-column-header"></div>
              {weekDays.map((day, i) => (
                <div key={i} className="day-column-header">
                  <div className="day-name">{dayNames[i]}</div>
                  <div className="day-date">{day.getDate()}</div>
                </div>
              ))}

              {PERIODS.map(period => (
                <div key={period.key} className="period-row">
                  <div className="period-label">{period.label}</div>
                  {weekDays.map((day, idx) => {
                    const evs = getEventosForDatePeriod(day, period.key);
                    return (
                      <div key={idx} className="day-cell">
                        {evs.map(ev => {
                          const turmaNome = turmaNameById.get(ev.turma) || 'Turma';
                          const discNome = disciplinaNameById.get(ev.disciplina) || 'Disciplina';
                          const inicio = (ev.hora_evento_inicio || '').slice(0, 5);
                          const fim = (ev.hora_evento_fim || '').slice(0, 5);
                          const horario = fim ? `${inicio}–${fim}` : `${inicio}`;
                          const isOrdinario = Boolean(ev.dia_semana);
                          const isConvocacao = ev.tipo === 'convocacao';
                          let tipoLabel = 'Extra';
                          let tipoClass = 'evento-extraordinario';
                          if (isOrdinario) {
                            tipoLabel = 'Turma';
                            tipoClass = 'evento-ordinario';
                          } else if (isConvocacao) {
                            tipoLabel = 'Convocação';
                            tipoClass = 'evento-convocacao';
                          }
                          return (
                            <div
                              key={ev.id}
                              className={`appointment-indicator ${tipoClass}`}
                              onClick={() => {
                                setSelectedEvento(ev);
                                if (isOrdinario) {
                                  setShowDetailModal(true);
                                } else if (isConvocacao) {
                                  setShowDetailConvocacaoModal(true);
                                } else {
                                  setShowDetailExtraModal(true);
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="appt-line"><strong>{horario}</strong> • {turmaNome}</div>
                              <div className="appt-line small text-muted">{discNome}{ev.sala ? ` • ${ev.sala}` : ''}</div>
                              <div className="appt-line appt-tipo">{tipoLabel}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EventoOrdinarioModal
        isOpen={isModalOpen}
        tipo={modalTipo}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); reloadEventos(); }}
      />

      <DetalheEventoOrdinario
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedEvento(null); }}
        onEdit={(evento) => { setShowDetailModal(false); setSelectedEvento(evento); setShowEditModal(true); }}
        eventId={selectedEvento?.id}
        fallbackEvento={selectedEvento}
        turmaNameById={turmaNameById}
        disciplinaNameById={disciplinaNameById}
      />

      <DetalheEventoExtraordinario
        isOpen={showDetailExtraModal}
        onClose={() => { setShowDetailExtraModal(false); setSelectedEvento(null); }}
        onEdit={(evento) => { setShowDetailExtraModal(false); setSelectedEvento(evento); setShowEditExtraModal(true); }}
        eventId={selectedEvento?.id}
        fallbackEvento={selectedEvento}
        turmaNameById={turmaNameById}
        disciplinaNameById={disciplinaNameById}
      />

      <DetalheEventoConvocacao
        isOpen={showDetailConvocacaoModal}
        onClose={() => { setShowDetailConvocacaoModal(false); setSelectedEvento(null); }}
        onEdit={(evento) => { setShowDetailConvocacaoModal(false); setSelectedEvento(evento); setShowEditConvocacaoModal(true); }}
        eventId={selectedEvento?.id}
        fallbackEvento={selectedEvento}
        turmaNameById={turmaNameById}
        disciplinaNameById={disciplinaNameById}
      />

      <EditarEventoOrdinario
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedEvento(null); }}
        evento={selectedEvento}
        turmas={turmas}
        disciplinas={disciplinas}
        onSuccess={() => { setShowEditModal(false); setSelectedEvento(null); reloadEventos(); }}
      />

      <EditarEventoExtraordinario
        isOpen={showEditExtraModal}
        onClose={() => { setShowEditExtraModal(false); setSelectedEvento(null); }}
        evento={selectedEvento}
        turmas={turmas}
        disciplinas={disciplinas}
        onSuccess={() => { setShowEditExtraModal(false); setSelectedEvento(null); reloadEventos(); }}
      />

      <EditarEventoConvocacao
        isOpen={showEditConvocacaoModal}
        onClose={() => { setShowEditConvocacaoModal(false); setSelectedEvento(null); }}
        evento={selectedEvento}
        turmas={turmas}
        disciplinas={disciplinas}
        onSuccess={() => { setShowEditConvocacaoModal(false); setSelectedEvento(null); reloadEventos(); }}
      />
    </div>
  );
};

export default Agenda;