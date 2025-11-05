import { useState, useEffect } from 'react';
import './Agenda.css';
import EventoOrdinarioModal from './EventoOrdinarioModal';
import EventoVisualizacaoModal from './EventoVisualizacaoModal';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    fetchEventos();
  }, [currentDate]);

  const fetchEventos = () => {
    fetch('http://localhost:8000/services/eventos/')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error(err));
  };

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

  const openEventoVisualModal = (evento) => {
    setSelectedEvento(evento);
    setIsVisualModalOpen(true);
  };

  const openEventoFormModal = (evento) => {
    setSelectedEvento(evento || null);
    setIsFormModalOpen(true);
    setIsVisualModalOpen(false);
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08h às 19h

  const getEventosForDate = (day) => {
    const dateStr = day.toISOString().split('T')[0];
    return eventos.filter(e => e.data_evento === dateStr);
  };

  return (
    <div className="agenda-wrapper">
      <div className="agenda-container">
        <div className="agenda-header">
          <h2>Agenda Semanal</h2>
          <p className="text-muted">Eventos da semana</p>
        </div>

        <button className="btn btn-success mb-3" onClick={() => openEventoFormModal(null)}>
          + Novo Evento Ordinário
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
                    {getEventosForDate(day)
                      .filter(e => parseInt(e.data_hora_evento.split(':')[0], 10) === hour)
                      .map(evento => (
                        <div
                          key={evento.id}
                          className={`appointment-indicator ${evento.tipo?.toLowerCase() || 'ord'}`}
                          onClick={() => openEventoVisualModal(evento)}
                        >
                          {evento.turma} - {evento.data_hora_evento.slice(0, 5)}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de visualização */}
      <EventoVisualizacaoModal
        evento={selectedEvento}
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
        onEdit={openEventoFormModal}
      />

      {/* Modal de criação/edição */}
      <EventoOrdinarioModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        evento={selectedEvento}
        onSuccess={fetchEventos}
      />
    </div>
  );
};

export default Agenda;
