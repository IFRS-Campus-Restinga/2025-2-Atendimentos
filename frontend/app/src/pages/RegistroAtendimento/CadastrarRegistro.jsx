import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './RegistroAtendimento.css';

function CadastrarRegistroAtendimento() {
  const DB_REGISTROS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/registro-atendimento' });
  const DB_EVENTOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/eventos' });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    evento: "",
    data_atendimento: "",
    descricao: ""
  });

  const [eventos, setEventos] = useState([]);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function recuperaEventos() {
      try {
        setLoading(true);

        // Busca todos os eventos
        const eventosResp = await DB_EVENTOS.get("/");
        const eventosData = Array.isArray(eventosResp.data) ? eventosResp.data : eventosResp.data.results;

        // Busca todos os registros
        const registrosResp = await DB_REGISTROS.get("/");
        const registrosData = Array.isArray(registrosResp.data) ? registrosResp.data : registrosResp.data.results;

        // IDs dos eventos que já têm registro
        const eventosComRegistro = registrosData.map(r => r.evento_id);

        // Filtra apenas os confirmados e que ainda não têm registro
        const filtrados = eventosData.filter(e => 
          e.status_atendimento === "CONF" && !eventosComRegistro.includes(e.id)
        );

        setEventos(filtrados);
      } catch (err) {
        console.error("Erro ao buscar eventos ou registros: ", err);
        alert("Falha ao carregar eventos.");
      } finally {
        setLoading(false);
      }
    }

    recuperaEventos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaRegistro(event) {
    event.preventDefault();

    if (!formData.evento || !formData.data_atendimento || !formData.descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_REGISTROS.post("/", {
        evento: parseInt(formData.evento, 10),
        data_atendimento: formData.data_atendimento,
        descricao: formData.descricao.trim()
      }, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Registro cadastrado com sucesso!");
      navigate("/registros");
    } catch (err) {
      console.error("Erro ao criar registro:", err);
      if (err.response && err.response.data) {
        setErros(err.response.data);
      } else {
        alert("Falha ao cadastrar registro!");
      }
    }
  }

  return (
    <div className="registro-container">
      <h1>Cadastrar Registro de Evento</h1>

      <form className="registro-form" onSubmit={adicionaRegistro}>
        <label>Evento:</label>
        {loading ? (
          <p>Carregando eventos...</p>
        ) : (
          eventos.length > 0 ? (
            <select
              name="evento"
              value={formData.evento}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {eventos.map(e => (
                <option key={e.id} value={e.id}>
                  {e.turma} ({new Date(e.data_evento).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <p>Nenhum evento disponível para registro.</p>
          )
        )}
        {erros.evento && <p className="erro-campo">{erros.evento}</p>}

        <label>Data e Hora do Evento:</label>
        <input
          type="datetime-local"
          name="data_atendimento"
          value={formData.data_atendimento}
          onChange={handleChange}
          required
        />
        {erros.data_atendimento && <p className="erro-campo">{erros.data_atendimento}</p>}

        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
        />
        {erros.descricao && <p className="erro-campo">{erros.descricao}</p>}

        <button type="submit" disabled={loading || eventos.length === 0}>
          Cadastrar Registro
        </button>
      </form>

      <Link to="/registros" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarRegistroAtendimento;
