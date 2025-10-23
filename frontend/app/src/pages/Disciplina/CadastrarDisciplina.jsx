import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Disciplina.css';

function CadastrarDisciplina() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/disciplinas' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    ativo: "true"
  });

  const [erros, setErros] = useState({
    nome: "",
    codigo: ""
  });

  // ==================== VALIDAÇÕES ====================
  function validateNome(value) {
    if (!value.trim()) return "O nome da disciplina é obrigatório.";
    if (value.trim().length > 50) return "O nome não pode ter mais de 50 caracteres.";
    if (value.trim() === "Teste") return "Não é possível salvar testes!";
    return "";
  }

  function validateCodigo(value) {
    if (!value.trim()) return "O código da disciplina é obrigatório.";
    if (value.trim().length < 3) return "O código deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 10) return "O código não pode ter mais de 10 caracteres.";
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
      case "codigo":
        setErros(prev => ({ ...prev, codigo: validateCodigo(value) }));
        break;
      default:
        break;
    }
  }

  // ==================== SUBMIT ====================
  async function adicionaDisciplina(event) {
    event.preventDefault();

    const nomeErro = validateNome(formData.nome);
    const codigoErro = validateCodigo(formData.codigo);

    if (nomeErro || codigoErro) {
      setErros({ nome: nomeErro, codigo: codigoErro });
      return;
    }

    try {
      await DB.post("/", {
        nome: formData.nome.trim(),
        codigo: formData.codigo.trim(),
        ativo: formData.ativo === "true"
      });
      alert("Disciplina cadastrada com sucesso!");
      setFormData({ nome: "", codigo: "", ativo: "true" });
      navigate("/disciplina");
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
      alert("Falha ao cadastrar disciplina!");
    }
  }

  // ==================== RENDER ====================
  return (
    <div className="disciplina-container">
      <h1>Cadastrar Disciplina</h1>

      <form className="disciplina-form" onSubmit={adicionaDisciplina}>
        <label>Nome da Disciplina:</label>
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          maxLength={50}
          required
        />
        {erros.nome && <p className="erro-campo">{erros.nome}</p>}

        <label>Código:</label>
        <input
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          minLength={3}
          maxLength={10}
          required
        />
        {erros.codigo && <p className="erro-campo">{erros.codigo}</p>}

        <label>Ativo:</label>
        <select name="ativo" value={formData.ativo} onChange={handleChange}>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>

        <button type="submit">Cadastrar Disciplina</button>
      </form>

      <Link to="/disciplina" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarDisciplina;
