import { useState, useEffect, useMemo } from 'react';
import './Agenda.css';
import EventoOrdinarioModal from './EventoOrdinarioModal';
import { getApiUrl } from '../../services/api';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    // Eventos ordinários
    fetch(getApiUrl('/services/evento-ordinario/'))
      .then(res => res.json())
      .then(data => setEventos(Array.isArray(data) ? data : data?.results || []))
      .catch(err => console.error('Erro ao buscar eventos:', err));

    // Turmas para mapear nome
    fetch(getApiUrl('turmas'))
      .then(res => res.json())
      .then(data => setTurmas(Array.isArray(data) ? data : data?.results || []))
      .catch(err => console.error('Erro ao buscar turmas:', err));

    // Disciplinas (se quiser exibir)
    fetch(getApiUrl('disciplinas'))
      .then(res => res.json())
      .then(data => setDisciplinas(Array.isArray(data) ? data : data?.results || []))
      .catch(err => console.error('Erro ao buscar disciplinas:', err));
  }, []);

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
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const offset = day === 0 ? -6 : 1 - day; // segunda-feira como início
    startOfWeek.setDate(startOfWeek.getDate() + offset);
    const days = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const getEventosForDateAndHour = (date, hour) => {
    const dateStr = date.toISOString().split('T')[0];
    return eventos.filter(e => {
      if (e.dia_semana !== dateStr) return false;
      const eventHour = new Date(e.data_hora).getHours();
      return eventHour === hour;
    });
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08h às 19h

  return (
    <div className="agenda-wrapper">
      <div className="agenda-container">
        <div className="agenda-header">
          <h2>Agenda Semanal</h2>
          <p className="text-muted">Eventos ordinários da semana</p>
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

          <div className="calendar-grid">
            <div className="time-column-header"></div>
            {weekDays.map((day, i) => (
              <div key={i} className="day-column-header">
                <div className="day-name">{dayNames[i]}</div>
                <div className="day-date">{day.getDate()}</div>
              </div>
            ))}

            {hours.map(hour => (
              <div key={hour} className="hour-row">
                <div className="time-label">{hour}:00</div>
                {weekDays.map((day, idx) => (
                  <div key={idx} className="day-cell">
                    {getEventosForDateAndHour(day, hour).map(evento => {
                      const turmaNome = turmaNameById.get?.(evento.turma) || 'Turma';
                      const discNome = disciplinaNameById.get?.(evento.disciplina) || 'Disciplina';
                      return (
                        <div key={evento.id} className="appointment-indicator">
                          {turmaNome} • {discNome} - {new Date(evento.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventoOrdinarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Agenda;
