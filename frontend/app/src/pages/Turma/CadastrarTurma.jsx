<<<<<<< HEAD
// CadastrarTurma.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Turma.css'; // você pode criar Turma.css ou usar o mesmo do curso
=======
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Turma.css';
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e

function CadastrarTurma() {
  const DB_TURMAS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/turmas' });
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
<<<<<<< HEAD
    periodo: "",
    turno: "",
    curso: ""
  });

  const [cursos, setCursos] = useState([]);

  // Recupera cursos para popular o select
=======
    turno: "",
    curso: "",
    semestre: "",
    ano: ""
  });

  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  useEffect(() => {
    async function recuperaCursos() {
      try {
        const response = await DB_CURSOS.get("/");
<<<<<<< HEAD
        const data = response.data;
        setCursos(Array.isArray(data) ? data : data.results);
=======
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        setCursos(data);
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
      } catch (err) {
        console.error("Erro ao buscar cursos: ", err);
      }
    }
<<<<<<< HEAD
=======

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
    recuperaCursos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
<<<<<<< HEAD
=======

    if (name === "curso") {
      const curso = cursos.find(c => String(c.id) === value);
      setCursoSelecionado(curso || null);
    }
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  }

  async function adicionaTurma(event) {
    event.preventDefault();

<<<<<<< HEAD
    // converte curso para inteiro
    const payload = {
      nome: formData.nome.trim(),
      periodo: formData.periodo.trim(),
      turno: formData.turno.trim(),
      curso: parseInt(formData.curso)
    };

    // validação simples
    if (!payload.nome || !payload.periodo || !payload.turno || !payload.curso) {
=======
    const payload = {
      nome: formData.nome.trim(),
      turno: formData.turno,
      curso_id: parseInt(formData.curso, 10)
    };

    const tipoCurso = cursoSelecionado?.tipo_curso;

    if (tipoCurso === "SUPERIOR" || tipoCurso === "PROEJA") {
      if (!formData.semestre) {
        alert("Preencha o campo semestre.");
        return;
      }
      payload.semestre = parseInt(formData.semestre, 10);
      payload.ano = null;
    } else {
      if (!formData.ano) {
        alert("Preencha o campo ano.");
        return;
      }
      payload.ano = parseInt(formData.ano, 10);
      payload.semestre = null;
    }

    if (!payload.nome || !payload.turno || !payload.curso_id) {
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
<<<<<<< HEAD
      await DB_TURMAS.post("/", payload, { headers: { "Content-Type": "application/json" } });
      alert("Turma cadastrada com sucesso!");
      navigate("/turma"); // redireciona para listagem de turmas
=======
      await DB_TURMAS.post("/", payload, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Turma cadastrada com sucesso!");
      navigate("/turma");
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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
<<<<<<< HEAD
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Período:</label>
        <input name="periodo" value={formData.periodo} onChange={handleChange} required />

        <label>Turno:</label>
        <input name="turno" value={formData.turno} onChange={handleChange} required />

        <label>Curso:</label>
        <select name="curso" value={formData.curso} onChange={handleChange} required>
=======
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>Turno:</label>
        <select
          name="turno"
          value={formData.turno}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="M">Manhã</option>
          <option value="T">Tarde</option>
          <option value="N">Noite</option>
        </select>

        <label>Curso:</label>
        <select
          name="curso"
          value={formData.curso}
          onChange={handleChange}
          required
        >
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
          <option value="">Selecione</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>{curso.nome}</option>
          ))}
        </select>

<<<<<<< HEAD
=======
        {cursoSelecionado && (
          cursoSelecionado.tipo_curso === "SUPERIOR" || cursoSelecionado.tipo_curso === "PROEJA" ? (
            <>
              <label>Semestre:</label>
              <input
                type="number"
                min="1"
                max="10"
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <label>Ano:</label>
              <input
                type="number"
                min="1"
                max="5"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                required
              />
            </>
          )
        )}

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
        <button type="submit">Cadastrar Turma</button>
      </form>

      <Link to="/turma" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarTurma;
