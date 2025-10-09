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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaDisciplina(event) {
    event.preventDefault();

    const nome = formData.nome.trim();
    const codigo = formData.codigo.trim();

    if (!nome || nome.length > 50 || !codigo || codigo.length < 3 || codigo.length > 10) {
      alert("Preencha corretamente:\n- Nome até 50 caracteres\n- Código entre 3 e 10 caracteres.");
      return;
    }

    const payload = {
      nome,
      codigo,
      ativo: formData.ativo === "true"
    };

    try {
      await DB.post("/", payload, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Disciplina cadastrada com sucesso!");
      navigate("/disciplina");
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
      alert("Falha ao cadastrar disciplina!");
    }
  }

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

        <label>Código:</label>
        <input
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          minLength={3}
          maxLength={10}
          required
        />

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