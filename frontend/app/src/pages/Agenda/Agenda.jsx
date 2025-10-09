import { useState } from 'react';
import './Agenda.css';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [atendimentos] = useState([]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getAtendimentosForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return atendimentos.filter(atendimento => 
      atendimento.dia_semana === dateStr
    );
  };



  const days = getDaysInMonth(currentDate);

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h2>Agenda de Atendimentos</h2>
        <p className="text-muted">Visualize os atendimentos no calendário</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => navigateMonth(-1)}
          >
            ← Anterior
          </button>
          <h3 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => navigateMonth(1)}
          >
            Próximo →
          </button>
        </div>

        <div className="calendar-grid">
          {dayNames.map((dayName) => (
            <div key={dayName} className="calendar-day-header">
              {dayName}
            </div>
          ))}

          {days.map((day, index) => {
            const atendimentosNaData = getAtendimentosForDate(day);
            const hasAtendimentos = atendimentosNaData.length > 0;
            
            return (
              <div
                key={index}
                className={`calendar-day ${day ? '' : 'empty'} ${hasAtendimentos ? 'has-appointments' : ''}`}
              >
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    {hasAtendimentos && (
                      <div className="appointment-indicator">
                        <small>{atendimentosNaData.length} agendamento(s)</small>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color has-appointments"></span>
          <span>Dias com atendimentos</span>
        </div>
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Dias disponíveis</span>
        </div>
      </div>


    </div>
  );
};

export default Agenda;