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
  const [erros, setErros] = useState({
    evento: "",
    data_atendimento: "",
    descricao: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function recuperaEventos() {
      try {
        setLoading(true);

        const eventosResp = await DB_EVENTOS.get("/");
        const eventosData = Array.isArray(eventosResp.data) ? eventosResp.data : eventosResp.data.results;

        const registrosResp = await DB_REGISTROS.get("/");
        const registrosData = Array.isArray(registrosResp.data) ? registrosResp.data : registrosResp.data.results;

        const eventosComRegistro = registrosData.map(r => r.evento_id);

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

  // ==================== VALIDAÇÃO ====================
  function validateEvento(value) {
    if (!value) return "Selecione um evento.";
    return "";
  }

  function validateData(value) {
    if (!value) return "Informe a data e hora do atendimento.";
    const dt = new Date(value);
    const ano2000 = new Date(2000, 0, 1);
    if (dt < ano2000) return "A data deve ser posterior a 01/01/2000.";
    return "";
  }

  function validateDescricao(value) {
    if (!value.trim()) return "Informe a descrição do registro.";
    if (value.trim().length > 300) return "A descrição não pode ter mais de 300 caracteres.";
    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validação em tempo real
    switch (name) {
      case "evento":
        setErros(prev => ({ ...prev, evento: validateEvento(value) }));
        break;
      case "data_atendimento":
        setErros(prev => ({ ...prev, data_atendimento: validateData(value) }));
        break;
      case "descricao":
        setErros(prev => ({ ...prev, descricao: validateDescricao(value) }));
        break;
      default:
        break;
    }
  }

  async function adicionaRegistro(event) {
    event.preventDefault();

    // Valida antes de enviar
    const eventoErro = validateEvento(formData.evento);
    const dataErro = validateData(formData.data_atendimento);
    const descricaoErro = validateDescricao(formData.descricao);

    if (eventoErro || dataErro || descricaoErro) {
      setErros({ evento: eventoErro, data_atendimento: dataErro, descricao: descricaoErro });
      return;
    }

    try {
      await DB_REGISTROS.post("/", {
        evento: parseInt(formData.evento, 10),
        data_atendimento: formData.data_atendimento,
        descricao: formData.descricao.trim()
      }, { headers: { "Content-Type": "application/json" } });

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

  // ==================== RENDER ====================
  return (
    <div className="registro-container">
      <h1>Cadastrar Registro de Evento</h1>

      <form className="registro-form" onSubmit={adicionaRegistro}>
        <label>Evento:</label>
        {loading ? (
          <p>Carregando eventos...</p>
        ) : (
          eventos.length > 0 ? (
            <select name="evento" value={formData.evento} onChange={handleChange} required>
              <option value="">Selecione</option>
              {eventos.map(e => (
                <option key={e.id} value={e.id}>
                  {e.turma} ({new Date(e.data_evento).toLocaleString()})
                </option>
              ))}
            </select>
          ) : <p>Nenhum evento disponível para registro.</p>
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
          maxLength={300}
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
