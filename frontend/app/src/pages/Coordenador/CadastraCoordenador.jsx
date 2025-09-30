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
<<<<<<< HEAD
    tipoPerfil: "COOR"
=======
    tipoPerfil: "COORD"
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function adicionaCoordenador(event) {
    event.preventDefault();

    if (!formData.nome || !formData.email || !formData.registro) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DB.post("/", formData);
      alert("Coordenador cadastrado com sucesso!");
<<<<<<< HEAD
      setFormData({ nome: "", email: "", registro: "", tipoPerfil: "COOR" });
=======
      setFormData({ nome: "", email: "", registro: "", tipoPerfil: "COORD" });
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
      navigate("/coord");
    } catch (err) {
      alert("Falha ao cadastrar coordenador!");
    }
  }

  return (
    <div className="coordenador-container">
      <h1>Cadastrar Coordenador</h1>
      <form className="coordenador-form" onSubmit={adicionaCoordenador}>
        <label>Nome:</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Email:</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>Registro:</label>
        <input name="registro" value={formData.registro} onChange={handleChange} required />

<<<<<<< HEAD
        <label>Tipo de Perfil:</label>
        <input name="tipoPerfil" value={formData.tipoPerfil} disabled />

=======
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
        <button type="submit">Cadastrar Coordenador</button>
      </form>
      <Link to="/coord" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastraCoordenador;