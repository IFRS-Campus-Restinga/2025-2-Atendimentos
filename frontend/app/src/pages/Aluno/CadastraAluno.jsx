import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Aluno.css";

function CadastraAluno() {
  const DB = axios.create({ baseURL: "http://127.0.0.1:8000/services/alunos/" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome_completo: "",
    matricula: "",
    curso: "",
    turma: "",
    alunoPEI: false,
  });

  const [erros, setErros] = useState({
    nome_completo: "",
    matricula: "",
    curso: "",
    turma: "",
  });

  function validateNome(value) {
    if (value.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 50) return "O nome não pode ter mais de 50 caracteres.";
    return "";
  }

  function validateMatricula(value) {
    if (!/^\d{1,15}$/.test(value)) return "A matrícula deve ter entre 1 e 15 dígitos numéricos.";
    return "";
  }

  function validateCurso(value) {
    if (value.trim().length < 3) return "O curso deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 50) return "O curso não pode ter mais de 50 caracteres.";
    return "";
  }

  function validateTurma(value) {
    if (value.trim().length < 3) return "A turma deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 50) return "A turma não pode ter mais de 50 caracteres.";
    return "";
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Valida em tempo real
    switch (name) {
      case "nome_completo":
        setErros(prev => ({ ...prev, nome_completo: validateNome(newValue) }));
        break;
      case "matricula":
        setErros(prev => ({ ...prev, matricula: validateMatricula(newValue) }));
        break;
      case "curso":
        setErros(prev => ({ ...prev, curso: validateCurso(newValue) }));
        break;
      case "turma":
        setErros(prev => ({ ...prev, turma: validateTurma(newValue) }));
        break;
      default:
        break;
    }
  }

  async function adicionaAluno(event) {
    event.preventDefault();

    // Valida antes de enviar
    const nomeErro = validateNome(formData.nome_completo);
    const matriculaErro = validateMatricula(formData.matricula);
    const cursoErro = validateCurso(formData.curso);
    const turmaErro = validateTurma(formData.turma);

    if (nomeErro || matriculaErro || cursoErro || turmaErro) {
      setErros({ nome_completo: nomeErro, matricula: matriculaErro, curso: cursoErro, turma: turmaErro });
      return;
    }

    try {
      await DB.post("", formData);
      alert("Aluno(a) cadastrado(a) com sucesso!");
      navigate("/alunos");
    } catch (err) {
      console.error("Erro na requisição:", err.response?.data || err.message);
      alert("Falha ao cadastrar aluno(a)!");
    }
  }

  return (
    <div className="aluno-container">
      <h1>Cadastrar Aluno</h1>
      <form className="aluno-form" onSubmit={adicionaAluno}>
        <label>Nome Completo:</label>
        <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} required />
        {erros.nome_completo && <p className="erro-campo">{erros.nome_completo}</p>}

        <label>Matrícula:</label>
        <input name="matricula" value={formData.matricula} onChange={handleChange} required placeholder="Ex: 123456789012345" />
        {erros.matricula && <p className="erro-campo">{erros.matricula}</p>}

        <label>Curso:</label>
        <input name="curso" value={formData.curso} onChange={handleChange} required />
        {erros.curso && <p className="erro-campo">{erros.curso}</p>}

        <label>Turma:</label>
        <input name="turma" value={formData.turma} onChange={handleChange} required />
        {erros.turma && <p className="erro-campo">{erros.turma}</p>}

        <div className="aluno-checkbox">
          <input name="alunoPEI" type="checkbox" checked={formData.alunoPEI} onChange={handleChange} id="alunoPEI" />
          <label htmlFor="alunoPEI">Aluno PEI</label>
        </div>

        <button type="submit">Cadastrar Aluno</button>
      </form>

      <Link to="/alunos" className="voltar-btn">Voltar para a Lista</Link>
    </div>
  );
}

export default CadastraAluno;
