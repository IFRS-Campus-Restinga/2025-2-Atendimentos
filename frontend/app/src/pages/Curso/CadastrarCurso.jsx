import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Curso.css';

function CadastrarCurso() {
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const COORDENADORES_API = 'http://127.0.0.1:8000/services/coord/';

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    tipo_curso: "",
    coordenador: ""
  });

  const [coordenadores, setCoordenadores] = useState([]);

  useEffect(() => {
    async function fetchCoordenadores() {
      try {
        const response = await axios.get(COORDENADORES_API);
        console.log("Coordenadores vindos da API:", response.data);

        setCoordenadores(response.data);
      } catch (err) {
        console.error("Erro ao buscar coordenadores:", err);
      }
    }
    fetchCoordenadores();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaCurso(event) {
    event.preventDefault();

    const payload = {
      nome: formData.nome.trim(),
      codigo: formData.codigo.trim(),
      tipo_curso: formData.tipo_curso,
      coordenador: formData.coordenador || null
    };

    if (!payload.nome || !payload.codigo || !payload.tipo_curso || !payload.coordenador) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_CURSOS.post("/", payload);
      alert("Curso cadastrado com sucesso!");
      setFormData({ nome: "", codigo: "", tipo_curso: "", coordenador: "" });
      navigate("/curso");
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      alert("Falha ao cadastrar curso!");
    }
  }

  return (
    <div className="curso-container">
      <h1>Cadastrar Curso</h1>

      <form className="curso-form" onSubmit={adicionaCurso}>
        <label>Nome do Curso:</label>
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>Código do Curso:</label>
        <input
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          required
        />

        <label>Tipo de Curso:</label>
        <select
          name="tipo_curso"
          value={formData.tipo_curso}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="SUPERIOR">Superior</option>
          <option value="TECNICO_INTEGRADO">Técnico Integrado</option>
          <option value="TECNICO_SUBSEQUENTE">Técnico Subsequente</option>
          <option value="PROEJA">Proeja</option>
        </select>

        <label>Coordenador:</label>
        <select
          name="coordenador"
          value={formData.coordenador}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          {coordenadores.map(coord => (
            <option key={coord.id} value={coord.id}>{coord.email}</option>
          ))}
        </select>

        <button type="submit">Cadastrar Curso</button>
      </form>

      <Link to="/curso" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarCurso;