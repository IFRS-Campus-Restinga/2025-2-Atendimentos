import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Curso.css';

function CadastrarCurso() {
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    duracao: "",
    tipocurso: "",
    coordenador: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaCurso(event) {
    event.preventDefault();

    const payload = {
      nome: formData.nome.trim(),
      duracao: parseInt(formData.duracao),
      tipocurso: formData.tipocurso,
      coordenador: formData.coordenador.trim()
    };

    if (!payload.nome || !payload.duracao || !payload.tipocurso || !payload.coordenador) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB_CURSOS.post("/", payload);
      alert("Curso cadastrado com sucesso!");
      setFormData({ nome: "", duracao: "", tipocurso: "", coordenador: "" });
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

        <button type="submit">Cadastrar Curso</button>
      </form>

      <Link to="/" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarCurso;
