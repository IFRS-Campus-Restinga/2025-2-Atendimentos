import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Professor.css";

function CadastraProfessor() {
  // Assumimos que o endpoint 'professores' agora aceita a criação
  // do Professor, Perfil Comum (telefone, cpf) e User (first_name, email)
  const DB = axios.create({ baseURL: "http://127.0.0.1:8000/services/professores/" });
  const navigate = useNavigate();

  // ESTADO: Inclui todos os campos da tabela de listagem (Nome, E-mail, CPF, Telefone, Registro, Disciplina)
  const [formData, setFormData] = useState({
    // User
    first_name: "", // Nome (Obrigatório)
    email: "",      // E-mail (Obrigatório para criar o User)

    // PerfilComum
    cpf: "",        // CPF (Opcional)
    telefone: "",   // Telefone de contato (Opcional)

    // Professor
    registro: "",   // Registro (Obrigatório)
    disciplina: ""  // Disciplina (Obrigatório)
  });

  const [erros, setErros] = useState({
    first_name: "",
    email: "",
    cpf: "",
    telefone: "",
    registro: "",
    disciplina: ""
  });

  // --- Funções de Validação ---
  function validateNome(value) {
    if (value.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 150) return "O nome não pode ter mais de 150 caracteres.";
    return "";
  }

  function validateEmail(value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Formato de e-mail inválido.";
    return "";
  }

  function validateRegistro(value) {
    if (value.trim().length < 3) return "O Registro deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 20) return "O Registro não pode ter mais de 20 caracteres.";
    return "";
  }

  function validateDisciplina(value) {
    if (value.trim().length < 3) return "A Disciplina deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 100) return "A Disciplina não pode ter mais de 100 caracteres.";
    return "";
  }

  function validateCPF(value) {
    if (value && !/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value)) return "Formato de CPF inválido.";
    return "";
  }

  function validateTelefone(value) {
    if (value && value.length > 0 && value.length < 10) return "Telefone deve ter pelo menos 10 dígitos (com DDD).";
    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let errorMsg = "";
    switch (name) {
      case "first_name":
        errorMsg = validateNome(value);
        break;
      case "email":
        errorMsg = validateEmail(value);
        break;
      case "cpf":
        errorMsg = validateCPF(value);
        break;
      case "telefone":
        errorMsg = validateTelefone(value);
        break;
      case "registro":
        errorMsg = validateRegistro(value);
        break;
      case "disciplina":
        errorMsg = validateDisciplina(value);
        break;
      default:
        break;
    }
    setErros(prev => ({ ...prev, [name]: errorMsg }));
  }

  async function adicionaProfessor(event) {
    event.preventDefault();

    const nomeErro = validateNome(formData.first_name);
    const emailErro = validateEmail(formData.email);
    const cpfErro = validateCPF(formData.cpf);
    const telefoneErro = validateTelefone(formData.telefone);
    const registroErro = validateRegistro(formData.registro);
    const disciplinaErro = validateDisciplina(formData.disciplina);

    setErros({
      first_name: nomeErro,
      email: emailErro,
      cpf: cpfErro,
      telefone: telefoneErro,
      registro: registroErro,
      disciplina: disciplinaErro
    });

    if (nomeErro || emailErro || cpfErro || telefoneErro || registroErro || disciplinaErro) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    try {
      await DB.post("", formData);
      alert("Professor(a) cadastrado(a) com sucesso!");
      navigate("/professores");
    } catch (err) {
      console.error("Erro na requisição:", err.response?.data || err.message);
      alert(`Falha ao cadastrar professor(a)!
Verifique o servidor ou detalhes: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  }

  return (
    <div className="professor-container">
      <h1>Cadastrar Professor</h1>
      <form className="professor-form" onSubmit={adicionaProfessor}>
        {/* CAMPOS DA TABELA DE LISTAGEM */}

        <label>Nome:</label>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        {erros.first_name && <p className="erro-campo">{erros.first_name}</p>}

        <label>E-mail:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {erros.email && <p className="erro-campo">{erros.email}</p>}

        <label>CPF (Opcional):</label>
        <input
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
        />
        {erros.cpf && <p className="erro-campo">{erros.cpf}</p>}

        <label>Telefone de Contato (Opcional):</label>
        <input
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(XX) XXXXX-XXXX"
        />
        {erros.telefone && <p className="erro-campo">{erros.telefone}</p>}

        <label>Registro (Obrigatório):</label>
        <input
          name="registro"
          value={formData.registro}
          onChange={handleChange}
          required
        />
        {erros.registro && <p className="erro-campo">{erros.registro}</p>}

        <label>Disciplina (Obrigatório):</label>
        <input
          name="disciplina"
          value={formData.disciplina}
          onChange={handleChange}
          required
        />
        {erros.disciplina && <p className="erro-campo">{erros.disciplina}</p>}

        <button type="submit">Cadastrar Professor</button>
      </form>

      <Link to="/professores" className="voltar-btn">Voltar para a Lista</Link>
    </div>
  );
}

export default CadastraProfessor;