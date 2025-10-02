import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Professor.css'; 

function CadastraProfessor() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/professores' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    registro: "",
    disciplina: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaProfessor(event) {
    event.preventDefault();

    if (!formData.registro || !formData.disciplina) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
       await DB.post("/", formData); 
      alert("Professor cadastrado com sucesso!");
      setFormData({ registro: "", disciplina: "" });
      navigate("/professores"); 
    } catch (err) {
      console.error("Erro ao cadastrar professor:", err.response ? err.response.data : err.message);
      alert("Falha ao cadastrar professor! Verifique os dados.");
    }
  }

  return (
    <div className="coordenador-container"> 
      <h1>Cadastrar Professor</h1>
      <form className="coordenador-form" onSubmit={adicionaProfessor}>
        
        <label>Registro:</label>
        <input 
          name="registro" 
          value={formData.registro} 
          onChange={handleChange} 
          maxLength={20}
          required 
        />

        <label>Disciplina:</label>
        <input 
          name="disciplina" 
          value={formData.disciplina} 
          onChange={handleChange} 
          maxLength={100}
          required 
        />

        <button type="submit">Cadastrar Professor</button>
      </form>
      <Link to="/professores" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastraProfessor;