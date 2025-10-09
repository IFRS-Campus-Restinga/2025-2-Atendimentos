import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './RegistroAtendimento.css';

function CadastrarRegistroAtendimento() {
  const DB_REGISTROS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/registros' });
  const DB_ATENDIMENTOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/atendimento' });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    atendimento: "",
    data_atendimento: "",
    descricao: ""
  });

  const [atendimentos, setAtendimentos] = useState([]);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function recuperaAtendimentos() {
      try {
        setLoading(true);

        // Busca todos os atendimentos
        const atendResp = await DB_ATENDIMENTOS.get("/");
        const atendimentosData = Array.isArray(atendResp.data) ? atendResp.data : atendResp.data.results;

        // Busca todos os registros
        const registrosResp = await DB_REGISTROS.get("/");
        const registrosData = Array.isArray(registrosResp.data) ? registrosResp.data : registrosResp.data.results;

        // IDs dos atendimentos que já têm registro
        const atendComRegistro = registrosData.map(r => r.atendimento_id);

        // Filtra apenas os confirmados e que ainda não têm registro
        const filtrados = atendimentosData.filter(a => 
          a.status === "CONF" && !atendComRegistro.includes(a.id)
        );

        setAtendimentos(filtrados);
      } catch (err) {
        console.error("Erro ao buscar atendimentos ou registros: ", err);
        alert("Falha ao carregar atendimentos.");
      } finally {
        setLoading(false);
      }
    }

    recuperaAtendimentos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaRegistro(event) {
    event.preventDefault();

    if (!formData.atendimento || !formData.data_atendimento || !formData.descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_REGISTROS.post("/", {
        atendimento: parseInt(formData.atendimento, 10),
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
      <h1>Cadastrar Registro de Atendimento</h1>

      <form className="registro-form" onSubmit={adicionaRegistro}>
        <label>Atendimento:</label>
        {loading ? (
          <p>Carregando atendimentos...</p>
        ) : (
          atendimentos.length > 0 ? (
            <select
              name="atendimento"
              value={formData.atendimento}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {atendimentos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.turma?.nome} - {a.tipo_atendimento} ({new Date(a.data_hora).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <p>Nenhum atendimento disponível para registro.</p>
          )
        )}
        {erros.atendimento && <p className="erro-campo">{erros.atendimento}</p>}

        <label>Data e Hora do Atendimento:</label>
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

        <button type="submit" disabled={loading || atendimentos.length === 0}>
          Cadastrar Registro
        </button>
      </form>

      <Link to="/registros" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarRegistroAtendimento;
