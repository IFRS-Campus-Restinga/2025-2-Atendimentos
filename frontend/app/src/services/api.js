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
    usuarioMe: '/services/api/usuario/me',
    profileStatus: '/services/api/profile/status/',           // ✅ adicionado
    complementoCadastro: '/services/api/usuario/complemento/', // ✅ adicionado
    eventoOrdinario: '/services/evento-ordinario/',
    eventoExtraordinario: '/services/evento-extraordinario/',
    eventoConvocacao: '/api/evento-convocacao/',              // ✅ novo endpoint
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

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function checkProfileStatus(role) {
  const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.profileStatus}?role=${encodeURIComponent(role)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Falha ao verificar status do perfil');
  return res.json();
}

export async function postComplementoCadastro(payload) {
  const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.complementoCadastro}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const contentType = res.headers.get('content-type');
  const data = contentType && contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) throw new Error(data?.detail || 'Falha ao completar cadastro');
  return data;
}

export async function getMyProfile(role) {
  // Usar o novo endpoint usuarioMe que substitui profileMe
  const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarioMe}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Falha ao obter dados do perfil');
  return res.json();
}

export async function saveUsuarioMe(payload) {
  const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarioMe}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || 'Falha ao salvar usuário');
  return data;
}

// --- Funções de Convocação ---
export async function criarConvocacao(payload) {
  const url = getApiUrl("eventoConvocacao");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Falha ao criar convocação");
  return data;
}

export async function listarConvocacoes() {
  const url = getApiUrl("eventoConvocacao");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Falha ao listar convocações");
  return res.json();
}

export async function editarConvocacao(id, payload) {
  const url = `${getApiUrl("eventoConvocacao")}${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Falha ao editar convocação");
  return data;
}

export async function encerrarConvocacao(id) {
  const url = `${getApiUrl("eventoConvocacao")}${id}/encerrar/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Falha ao encerrar convocação");
  return res.json();
}

export async function cancelarConvocacao(id) {
  const url = `${getApiUrl("eventoConvocacao")}${id}/cancelar/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Falha ao cancelar convocação");
  return res.json();
}
