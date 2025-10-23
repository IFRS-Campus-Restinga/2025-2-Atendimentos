import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Curso.css';

function CadastrarCurso() {
  const DB_CURSOS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const COORDENADORES_API = 'http://127.0.0.1:8000/services/coord/';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    tipo_curso: "",
    coordenador: ""
  });

  const [coordenadores, setCoordenadores] = useState([]);
  const [erros, setErros] = useState({
    nome: "",
    codigo: "",
    tipo_curso: "",
    coordenador: ""
  });

  useEffect(() => {
    async function fetchCoordenadores() {
      try {
        const response = await axios.get(COORDENADORES_API);
        setCoordenadores(response.data);
      } catch (err) {
        console.error("Erro ao buscar coordenadores:", err);
      }
    }
    fetchCoordenadores();
  }, []);

  // ==================== VALIDAÇÕES ====================
  function validateNome(value) {
    if (!value.trim()) return "O nome do curso é obrigatório.";
    if (value.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 255) return "O nome não pode ter mais de 255 caracteres.";
    return "";
  }

  function validateCodigo(value) {
    if (!value.trim()) return "O código do curso é obrigatório.";
    if (value.trim().length < 3) return "O código deve ter pelo menos 3 caracteres.";
    if (value.trim().length > 4) return "O código não pode ter mais de 4 caracteres.";
    return "";
  }

  function validateTipo(value) {
    if (!value) return "Selecione o tipo de curso.";
    return "";
  }

  function validateCoordenador(value) {
    if (!value) return "Selecione um coordenador.";
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
      case "tipo_curso":
        setErros(prev => ({ ...prev, tipo_curso: validateTipo(value) }));
        break;
      case "coordenador":
        setErros(prev => ({ ...prev, coordenador: validateCoordenador(value) }));
        break;
      default:
        break;
    }
  }

  // ==================== SUBMIT ====================
  async function adicionaCurso(event) {
    event.preventDefault();

    // Valida antes de enviar
    const nomeErro = validateNome(formData.nome);
    const codigoErro = validateCodigo(formData.codigo);
    const tipoErro = validateTipo(formData.tipo_curso);
    const coordErro = validateCoordenador(formData.coordenador);

    if (nomeErro || codigoErro || tipoErro || coordErro) {
      setErros({ nome: nomeErro, codigo: codigoErro, tipo_curso: tipoErro, coordenador: coordErro });
      return;
    }

    try {
      await DB_CURSOS.post("/", {
        nome: formData.nome.trim(),
        codigo: formData.codigo.trim(),
        tipo_curso: formData.tipo_curso,
        coordenador: formData.coordenador
      });
      alert("Curso cadastrado com sucesso!");
      setFormData({ nome: "", codigo: "", tipo_curso: "", coordenador: "" });
      navigate("/curso");
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      alert("Falha ao cadastrar curso!");
    }
  }

  // ==================== RENDER ====================
  return (
    <div className="curso-container">
      <h1>Cadastrar Curso</h1>

      <form className="curso-form" onSubmit={adicionaCurso}>
        <label>Nome do Curso:</label>
        <input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        {erros.nome && <p className="erro-campo">{erros.nome}</p>}

        <label>Código do Curso:</label>
        <input
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          required
        />
        {erros.codigo && <p className="erro-campo">{erros.codigo}</p>}

        <label>Tipo de Curso:</label>
        <select
          name="tipo_curso"
          value={formData.tipo_curso}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="SUPERIOR">Superior</option>
          <option value="TECNICO_INTEGRADO">Técnico Integrado</option>
          <option value="TECNICO_SUBSEQUENTE">Técnico Subsequente</option>
          <option value="PROEJA">Proeja</option>
        </select>
        {erros.tipo_curso && <p className="erro-campo">{erros.tipo_curso}</p>}

        <label>Coordenador:</label>
        <select
          name="coordenador"
          value={formData.coordenador}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          {coordenadores.map(coord => (
            <option key={coord.id} value={coord.id}>{coord.email}</option>
          ))}
        </select>
        {erros.coordenador && <p className="erro-campo">{erros.coordenador}</p>}

        <button type="submit">Cadastrar Curso</button>
      </form>

      <Link to="/curso" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default CadastrarCurso;
