import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Coordenador.css';

function CadastraCoordenador() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/coord' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    registro: "",
    tipoPerfil: "COORD"
  });

  const [erros, setErros] = useState({
    nome: "",
    email: "",
    registro: ""
  });

  // ==================== VALIDAÇÕES ====================
  function validateNome(value) {
    if (!value.trim()) return "O nome é obrigatório.";
    if (value.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 100) return "O nome não pode ter mais de 100 caracteres.";
    return "";
  }

  function validateEmail(value) {
    if (!value.trim()) return "O email é obrigatório.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email inválido.";
    return "";
  }

  function validateRegistro(value) {
    if (!value.trim()) return "O registro é obrigatório.";
    if (value.trim().length < 3) return "O registro deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 50) return "O registro não pode ter mais de 50 caracteres.";
    return "";
  }

  // ==================== HANDLE CHANGE ====================
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validação em tempo real
    switch (name) {
      case "nome":
        setErros(prev => ({ ...prev, nome: validateNome(value) }));
        break;
      case "email":
        setErros(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case "registro":
        setErros(prev => ({ ...prev, registro: validateRegistro(value) }));
        break;
      default:
        break;
    }
  }

  // ==================== SUBMIT ====================
  async function adicionaCoordenador(event) {
    event.preventDefault();

    const nomeErro = validateNome(formData.nome);
    const emailErro = validateEmail(formData.email);
    const registroErro = validateRegistro(formData.registro);

    if (nomeErro || emailErro || registroErro) {
      setErros({ nome: nomeErro, email: emailErro, registro: registroErro });
      return;
    }

    try {
      await DB.post("/", formData);
      alert("Coordenador cadastrado com sucesso!");
      setFormData({ nome: "", email: "", registro: "", tipoPerfil: "COORD" });
      navigate("/coord");
    } catch (err) {
      console.error("Erro ao criar coordenador:", err);
      alert("Falha ao cadastrar coordenador!");
    }
  }

  // ==================== RENDER ====================
  return (
    <div className="coordenador-container">
      <h1>Cadastrar Coordenador</h1>
      <form className="coordenador-form" onSubmit={adicionaCoordenador}>

        <label>Nome:</label>
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        {erros.nome && <p className="erro-campo">{erros.nome}</p>}

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {erros.email && <p className="erro-campo">{erros.email}</p>}

        <label>Registro:</label>
        <input
          name="registro"
          value={formData.registro}
          onChange={handleChange}
          required
        />
        {erros.registro && <p className="erro-campo">{erros.registro}</p>}

        <button type="submit">Cadastrar Coordenador</button>
      </form>

      <Link to="/coord" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastraCoordenador;
