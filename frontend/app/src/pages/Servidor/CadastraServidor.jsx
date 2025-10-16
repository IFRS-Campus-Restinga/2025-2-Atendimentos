import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Servidor.css';

function CadastraServidor() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/servidores' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    registro: "",
    servidor: "",
    tipoPerfil: "SERV"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaServidor(event) {
    event.preventDefault();

    const { nome, email, registro, servidor } = formData;

    if (!nome || !email || !registro || !servidor) {
      alert("Preencha todos os campos obrigatórios: Nome, Email, Registro e Servidor/Detalhe.");
      return;
    }

    try {
      await DB.post("/", formData);
      alert("Servidor cadastrado com sucesso!");
      setFormData({ nome: "", email: "", registro: "", servidor: "", tipoPerfil: "SERV" });
      navigate("/servidores");
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Falha ao cadastrar servidor! Verifique os dados.";

      if (errorData) {
        errorMessage += "\n\nDetalhes do Erro do Backend:\n";
        for (const [key, value] of Object.entries(errorData)) {
          errorMessage += `Campo ${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
        }
      } else {
        errorMessage += `\n\nErro de Conexão: ${err.message}`;
      }

      console.error("Erro ao cadastrar servidor:", errorData || err.message);
      alert(errorMessage);
    }
  }

  return (
    <div className="servidor-container">
      <h1>Cadastrar Servidor</h1>
      <form className="servidor-form" onSubmit={adicionaServidor}>
        <label>Nome:</label>
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          maxLength={100}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Registro:</label>
        <input
          name="registro"
          value={formData.registro}
          onChange={handleChange}
          maxLength={20}
          required
        />
        <label>Servidor (Detalhe):</label>
        <input
          name="servidor"
          value={formData.servidor}
          onChange={handleChange}
          maxLength={30}
          required
        />
        <button type="submit">Cadastrar Servidor</button>
      </form>
      <Link to="/servidores" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastraServidor;