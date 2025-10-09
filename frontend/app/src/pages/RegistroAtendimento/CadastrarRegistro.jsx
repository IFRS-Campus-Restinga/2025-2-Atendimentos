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

  useEffect(() => {
    async function recuperaAtendimentos() {
      try {
        const response = await DB_ATENDIMENTOS.get("/");
        const data = Array.isArray(response.data) ? response.data : response.data.results;

        // Filtra apenas os atendimentos confirmados
        setAtendimentos(data.filter(a => a.status === "CONF"));
      } catch (err) {
        console.error("Erro ao buscar atendimentos: ", err);
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

    // Validação simples
    if (!formData.atendimento || !formData.data_atendimento || !formData.descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_REGISTROS.post("/", {
        atendimento: parseInt(formData.atendimento, 10), // 👈 aqui deve ser 'atendimento', não 'atendimento_id'
        data_atendimento: formData.data_atendimento,
        descricao: formData.descricao.trim()
    }, {
        headers: { "Content-Type": "application/json" }
    });

      alert("Registro cadastrado com sucesso!");
      navigate("/registros"); // ou rota de listagem de registros
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

        <button type="submit">Cadastrar Registro</button>
      </form>

      <Link to="/registros" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarRegistroAtendimento;
