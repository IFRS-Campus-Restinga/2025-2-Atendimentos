// CadastrarTurma.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Turma.css'; // você pode criar Turma.css ou usar o mesmo do curso

function CadastrarTurma() {
  const DB_TURMAS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/turmas' });
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    periodo: "",
    turno: "",
    curso: ""
  });

  const [cursos, setCursos] = useState([]);

  // Recupera cursos para popular o select
  useEffect(() => {
    async function recuperaCursos() {
      try {
        const response = await DB_CURSOS.get("/");
        const data = response.data;
        setCursos(Array.isArray(data) ? data : data.results);
      } catch (err) {
        console.error("Erro ao buscar cursos: ", err);
      }
    }
    recuperaCursos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaTurma(event) {
    event.preventDefault();

    // converte curso para inteiro
    const payload = {
      nome: formData.nome.trim(),
      periodo: formData.periodo.trim(),
      turno: formData.turno.trim(),
      curso: parseInt(formData.curso)
    };

    // validação simples
    if (!payload.nome || !payload.periodo || !payload.turno || !payload.curso) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_TURMAS.post("/", payload, { headers: { "Content-Type": "application/json" } });
      alert("Turma cadastrada com sucesso!");
      navigate("/turma"); // redireciona para listagem de turmas
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      alert("Falha ao cadastrar turma!");
    }
  }

  return (
    <div className="turma-container">
      <h1>Cadastrar Turma</h1>

      <form className="turma-form" onSubmit={adicionaTurma}>
        <label>Nome da Turma:</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Período:</label>
        <input name="periodo" value={formData.periodo} onChange={handleChange} required />

        <label>Turno:</label>
        <input name="turno" value={formData.turno} onChange={handleChange} required />

        <label>Curso:</label>
        <select name="curso" value={formData.curso} onChange={handleChange} required>
          <option value="">Selecione</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>{curso.nome}</option>
          ))}
        </select>

        <button type="submit">Cadastrar Turma</button>
      </form>

      <Link to="/turma" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarTurma;
