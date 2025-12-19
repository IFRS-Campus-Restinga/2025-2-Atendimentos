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
    professor: "",
    aluno: "",
    disciplina: "",
    email_aluno: "",
    descricao_convocacao: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    status: "",
    finalidade: "",
    modalidade_presencial: "",
    sala: "",
    link: "",
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
    if (name === "modalidade_presencial") {
      const modalidade_presencial = modalidade_presencial.find(c => String(c.id) === value);
      setModalidade_presencialSelecionado(modalidade_presencial || null);
    }
  };

  const [modalidade_presencialSelecionado, setModalidade_presencialSelecionado] = useState(null);
  const tipoModalidade = modalidade_presencialSelecionado;

  async function salvarAtendimento(e) {

    if (hora_fim <= hora_inicio) {
      alert("O horário de término deve ser maior que o de início.");
      return;
  }
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
          Professor
          <select
            name="professor"
            value={form.professor}
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
          Descricao
          <input
            type="text"
            name="descricao_convocacao"
            value={form.descricao_convocacao}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Disciplina
          <input
            type="text"
            name="disciplina"
            value={form.disciplina}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Aluno
          <select
            name="aluno"
            value={form.aluno}
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
          Email do Aluno
          <select
            name="aluno"
            value={form.aluno}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
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
            <option value="CONVOCADO">Convocado</option>
            <option value="REALIZADO">Realizado</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="AUSENTE">Ausente</option>
          </select>
        </label>

        <label>
          Finalidade
          <select
            name="finalidade"
            value={form.Finalidade}
            onChange={handleChange}
          >
            <option value="ORIENTACAO_EST">Orientacao Estudos</option>
            <option value="REVISAO">Revisao</option>
            <option value="ORIENTACAO_ATI">Orientacao Atividade</option>
            <option value="OUTRO">Outro</option>
          </select>
        </label>

        <label>
          Modalidade
          <select
            name="modalidade_presencial"
            value={form.modalidade_presencial}
            onChange={handleChange}
          >
            <option value="PRESENCIAL">Presencial</option>
            <option value="ONLINE">Online</option>
          </select>
        </label>

        <label>
          Sala
          <input
            type="text"
            name="sala"
            value={form.sala}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Link
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            required
          />
        </label>

        

        {/* {modalidade_presencialSelecionado && (
          modalidade_presencialSelecionado === "PRESENCIAL" ? (
            <>
              <label>Sala:</label>
              <input
                type="text"
                name="sala"
                value={formData.sala}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <label>Link:</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </>
          )
        )} */}



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
