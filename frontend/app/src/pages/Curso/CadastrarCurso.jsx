<<<<<<< HEAD
import { useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Curso.css';

function CadastrarCurso() {
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
<<<<<<< HEAD
=======
  const COORDENADORES_API = 'http://127.0.0.1:8000/services/coord/';

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
<<<<<<< HEAD
    duracao: "",
    tipocurso: "",
    coordenador: ""
  });

=======
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

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaCurso(event) {
    event.preventDefault();

    const payload = {
      nome: formData.nome.trim(),
<<<<<<< HEAD
      duracao: parseInt(formData.duracao),
      tipocurso: formData.tipocurso,
      coordenador: formData.coordenador.trim()
    };

    if (!payload.nome || !payload.duracao || !payload.tipocurso || !payload.coordenador) {
=======
      codigo: formData.codigo.trim(),
      tipo_curso: formData.tipo_curso,
      coordenador: formData.coordenador || null
    };

    if (!payload.nome || !payload.codigo || !payload.tipo_curso || !payload.coordenador) {
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_CURSOS.post("/", payload);
      alert("Curso cadastrado com sucesso!");
<<<<<<< HEAD
      setFormData({ nome: "", duracao: "", tipocurso: "", coordenador: "" });
=======
      setFormData({ nome: "", codigo: "", tipo_curso: "", coordenador: "" });
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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
<<<<<<< HEAD
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Duração:</label>
        <input type="number" name="duracao" value={formData.duracao} onChange={handleChange} required min={1} />

        <label>Tipo de Curso:</label>
          <select name="tipocurso" value={formData.tipocurso} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="SAE">superior_agroecologia</option>
            <option value="SADS">superior_ads</option>
            <option value="SEI">superior_eletronica_industrial</option>
            <option value="SGDL">superior_gestao_desportiva_lazer</option>
            <option value="SLPE">superior_letras_port_esp</option>
            <option value="SPG">superior_processos_gerenciais</option>
            <option value="TCS">tecnico_concomitante_subsequente</option>
            <option value="TI">tecnico_integrado</option>
            <option value="TP">tecnico_proeja</option>
            <option value="TS">tecnico_subsequente</option>
          </select>


        <label>Coordenador:</label>
        <input name="coordenador" value={formData.coordenador} onChange={handleChange} required />
=======
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
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e

        <button type="submit">Cadastrar Curso</button>
      </form>

      <Link to="/curso" className="voltar-btn">Voltar</Link>
    </div>
  );
}

<<<<<<< HEAD
export default CadastrarCurso;
=======
export default CadastrarCurso;
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
