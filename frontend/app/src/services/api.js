// Configuração da API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  endpoints: {
    googleLogin: '/services/api/google-login/',
    alunos: '/services/alunos/',
    coordenadores: '/services/coord/',
    cursos: '/services/cursos/',
    disciplinas: '/services/disciplinas/',
    professores: '/services/professores/',
    turmas: '/services/turmas/',
  }
};

// Helper para construir URLs completas
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint] || endpoint}`;
};

export const dateUtils = {
  formatDate: (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  formatDateTime: (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  isSameDay: (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  },

  getMonthName: (monthIndex) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex];
  },

  getDayName: (dayIndex) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  }
};

export default dateUtils;