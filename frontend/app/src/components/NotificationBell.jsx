import { useState, useEffect } from "react";
import axios from "axios";
import "./notification.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [lidas, setLidas] = useState([]);

  const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/services/notificacoes',
  });

  useEffect(() => {
    async function fetchNotificacoes() {
      try {
        const response = await API.get("/");

        // AGORA response.data É SEMPRE UM ARRAY → map funciona
        const notificacoesFiltradas = response.data
          .filter((n) => !lidas.includes(n.id)) // ← IGNORA as que foram marcadas como lidas
          .map((n) => ({
            id: n.id,
            mensagem: n.mensagem,
            status: n.status,
          }));

        setNotificacoes(notificacoesFiltradas);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    }

    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 5000);
    return () => clearInterval(interval);
  }, [lidas]);

  function marcarComoLida(id) {
    setLidas((prev) => [...prev, id]);        // registra que foi lida
    setNotificacoes((prev) => prev.filter((n) => n.id !== id)); // remove da lista atual
  }

  return (
    <div className="notification-wrapper">
      <button className="notification-btn" onClick={() => setOpen(!open)}>
        <i className="bi bi-bell"></i>
        {notificacoes.length > 0 && <span className="badge">{notificacoes.length}</span>}
      </button>

      {open && (
        <div className="notification-dropdown shadow">
          <h6 className="title">Notificações</h6>

          {notificacoes.length === 0 ? (
            <p className="empty">Nenhuma notificação</p>
          ) : (
            notificacoes.map((n) => (
              <div key={n.id} className="notification-item">
                <span>{n.mensagem}</span>
                {/* Botãozinho para marcar como lida */}
                <button
                  className="btn-lida"
                  onClick={() => marcarComoLida(n.id)}
                >
                  ✓
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
