import { useState, useEffect } from "react";
import axios from "axios";
import "./notification.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);

  const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/services/notificacoes',
  });

  useEffect(() => {
    async function fetchNotificacoes() {
      try {
        const response = await API.get("/");

        // AGORA response.data É SEMPRE UM ARRAY → map funciona
        setNotificacoes(
          response.data.map((n) => ({
            id: n.id,
            mensagem: n.mensagem,
            status: n.status,
          }))
        );
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    }

    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 5000);
    return () => clearInterval(interval);
  }, []);

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
                {n.mensagem}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
