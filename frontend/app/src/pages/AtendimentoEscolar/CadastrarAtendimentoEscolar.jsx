import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Atendimento.css";

const CadastrarAtendimentoEscolar = () => {
  const navigate = useNavigate();

  const DB = axios.create({
    baseURL: "http://127.0.0.1:8000/services",
  });

  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    solicitante: "",
    titulo: "",
    descricao: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    status: "AGENDADO",
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const response = await DB.get("/usuario/");
      const data = response.data;
      setUsuarios(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function salvarAtendimento(e) {
    e.preventDefault();

    try {
      await DB.post("/atendimentos-escolares/", form);
      alert("Atendimento cadastrado com sucesso!");
      navigate("/atendimentos");
    } catch (err) {
      console.error("Erro ao cadastrar atendimento:", err.response?.data);
      alert("Erro ao cadastrar atendimento");
    }
  }

  return (
    <div className="pagina-atendimentos">
      <h2 className="titulo-pagina">Cadastrar Atendimento Escolar</h2>

      <form className="form-atendimento" onSubmit={salvarAtendimento}>

        <label>
          Solicitante
          <select
            name="solicitante"
            value={form.solicitante}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome || u.username || u.email}
              </option>
            ))}
          </select>
        </label>

        <label>
          Título
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
          />
        </label>

        <label>
          Data
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
          />
        </label>

        <div className="linha-horarios">
          <label>
            Hora Início
            <input
              type="time"
              name="hora_inicio"
              value={form.hora_inicio}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Hora Fim
            <input
              type="time"
              name="hora_fim"
              value={form.hora_fim}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="AGENDADO">Agendado</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="REALIZADO">Realizado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </label>

        <div className="acoes-form">
          <button type="submit" className="botao-salvar">
            Salvar
          </button>

          <button
            type="button"
            className="botao-cancelar"
            onClick={() => navigate("/atendimentos")}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default CadastrarAtendimentoEscolar;
