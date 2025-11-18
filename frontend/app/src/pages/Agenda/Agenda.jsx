import { useState, useEffect, useMemo, useCallback } from 'react';
import './Agenda.css';
import EventoOrdinarioModal from './EventoOrdinarioModal';
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
  if (minutes < PERIODS[0].start) return PERIODS[0].key; // antes das 08:00 => manhã
  if (minutes > PERIODS[PERIODS.length - 1].end) return PERIODS[PERIODS.length - 1].key; // depois de 22:30 => noite
  return 'TARDE'; // fallback para lacunas
}

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]); // unified events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const reloadEventos = useCallback(async () => {
    try {
      const [ordRes, extraRes, baseRes] = await Promise.all([
        fetch(getApiUrl('/services/evento-ordinario/')),
        fetch(getApiUrl('/services/evento-extraordinario/')),
        fetch(getApiUrl('/services/eventos/'))
      ]);
      const ordJson = await ordRes.json().catch(() => []);
      const extraJson = await extraRes.json().catch(() => []);
      const baseJson = await baseRes.json().catch(() => []);
      const ordList = Array.isArray(ordJson) ? ordJson : ordJson?.results || [];
      const extraList = Array.isArray(extraJson) ? extraJson : extraJson?.results || [];
      const baseList = Array.isArray(baseJson) ? baseJson : baseJson?.results || [];
      const mergedRaw = [
        ...ordList,
        ...extraList,
        ...baseList,
      ];
      const unique = new Map();
      mergedRaw.forEach(ev => { if (!unique.has(ev.id)) unique.set(ev.id, ev); });
      setEventos(Array.from(unique.values()));
    } catch (e) {
      console.error('Erro eventos:', e);
    }
  }, []);

  useEffect(() => {
    // initial load
    reloadEventos();
    (async () => {
      try {
        const tRes = await fetch(getApiUrl('turmas'));
        const tJson = await tRes.json();
        setTurmas(Array.isArray(tJson) ? tJson : tJson?.results || []);
      } catch (e) { console.error('Erro turmas:', e); }

      try {
        const dRes = await fetch(getApiUrl('disciplinas'));
        const dJson = await dRes.json();
        setDisciplinas(Array.isArray(dJson) ? dJson : dJson?.results || []);
      } catch (e) { console.error('Erro disciplinas:', e); }
    })();
  }, [reloadEventos]);

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
    const offset = day === 0 ? -6 : 1 - day; // Monday start
    start.setDate(start.getDate() + offset);
    const days = [];
    for (let i = 0; i < 6; i++) { // Mon-Sat
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

  function getDateStr(d) { return d.toISOString().split('T')[0]; }

  const grouped = useMemo(() => {
    const map = {};
    eventos.forEach(ev => {
      const dateKey = ev.data_evento; // YYYY-MM-DD from backend
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
          <p className="text-muted">Eventos (ordinários, extraordinários e futuros tipos)</p>
        </div>

        <button className="btn btn-success mb-3" onClick={() => setIsModalOpen(true)}>
          + Novo Atendimento de Turma
        </button>

        <div className="weekly-calendar">
          <div className="calendar-header">
            <button className="btn btn-outline-secondary" onClick={() => navigateWeek(-1)}>← Semana Anterior</button>
            <h3 className="month-year">
              {weekDays[0].toLocaleDateString()} - {weekDays[5].toLocaleDateString()}
            </h3>
            <button className="btn btn-outline-secondary" onClick={() => navigateWeek(1)}>Próxima Semana →</button>
          </div>

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
                        const inicio = (ev.hora_evento_inicio || '').slice(0,5);
                        const fim = (ev.hora_evento_fim || '').slice(0,5);
                        const horario = fim ? `${inicio}–${fim}` : `${inicio}`;
                        return (
                          <div key={ev.id} className="appointment-indicator">
                            <div className="appt-line"><strong>{horario}</strong> • {turmaNome}</div>
                            <div className="appt-line small text-muted">{discNome}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventoOrdinarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); reloadEventos(); }}
      />
    </div>
  );
};

export default Agenda;
