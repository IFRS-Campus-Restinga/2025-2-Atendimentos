import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Aluno.css";

function CadastraAluno() {
  const ALUNO_API_URL = "http://127.0.0.1:8000/services/alunos/";
  const DB = axios.create({ baseURL: ALUNO_API_URL });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome_completo: "",
    matricula: "",
    curso: "",
    turma: "",
    alunoPEI: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  }

  async function adicionaAluno(event) {
    event.preventDefault();

    // Validação: matrícula deve conter entre 1 e 15 dígitos numéricos
    if (!/^\d{1,15}$/.test(formData.matricula)) {
      alert("A matrícula deve conter entre 1 e 15 dígitos numéricos.");
      return;
    }

    if (
      !formData.nome_completo ||
      !formData.matricula ||
      !formData.curso ||
      !formData.turma
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB.post("", formData);
      alert("Aluno(a) cadastrado(a) com sucesso!");

      setFormData({
        nome_completo: "",
        matricula: "",
        curso: "",
        turma: "",
        alunoPEI: false,
      });

      navigate("/alunos");
    } catch (err) {
      console.error("Erro na requisição:", err.response?.data || err.message);
      alert("Falha ao cadastrar aluno(a)! Verifique o console para detalhes.");
    }
  }

  return (
    <div className="aluno-container">
      <h1>Cadastrar Aluno</h1>
      <form className="aluno-form" onSubmit={adicionaAluno}>
        <label>Nome Completo:</label>
        <input
          name="nome_completo"
          value={formData.nome_completo}
          onChange={handleChange}
          required
        />

        <label>Matrícula (até 15 dígitos):</label>
        <input
          name="matricula"
          type="text"
          value={formData.matricula}
          onChange={handleChange}
          required
          placeholder="Ex: 123456789012345"
        />

        <label>Nome do Curso:</label>
        <input
          name="curso"
          value={formData.curso}
          onChange={handleChange}
          required
        />

        <label>Turma:</label>
        <input
          name="turma"
          value={formData.turma}
          onChange={handleChange}
          required
        />

        <div className="aluno-checkbox">
          <input
            name="alunoPEI"
            type="checkbox"
            checked={formData.alunoPEI}
            onChange={handleChange}
            id="alunoPEI"
          />
          <label htmlFor="alunoPEI">
            Aluno PEI (Necessita de mais tempo nos Atendimentos)
          </label>
        </div>

        <button type="submit">Cadastrar Aluno</button>
      </form>

      <Link to="/alunos" className="voltar-btn">
        Voltar para a Lista
      </Link>
    </div>
  );
}

export default CadastraAluno;