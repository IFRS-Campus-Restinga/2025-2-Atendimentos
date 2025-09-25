import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Disciplinas() {
  //const DBDISCIPLINAS = axios.post('http://127.0.0.1:8000/services/disciplinas');
  const DBDISCIPLINAS = axios.create({ baseURL: 'http://127.0.0.1:8000/services/disciplinas' });
  const [disciplinasCadastradas, setDisciplinasCadastradas] = useState([]);
  const [formData, setFormData] = useState({
    curso: "",
    professor: "",
    nome: "",
    codigo: "",
    carga_horaria: "",
    semestre: "",
    descricao: "",
    ativo: "true"
  });

  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaDisciplinas() {
    try {
      const response = await DBDISCIPLINAS.get("/");
      const data = response.data;
      setDisciplinasCadastradas(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar disciplinas: ", err);
    }
  }

  async function adicionaDisciplina(event) {
    event.preventDefault();

    const payload = {
      curso: formData.curso.trim(),
      professor: formData.professor.trim() || null,
      nome: formData.nome.trim(),
      codigo: formData.codigo.trim(),
      carga_horaria: parseInt(formData.carga_horaria),
      semestre: parseInt(formData.semestre),
      descricao: formData.descricao.trim(),
      ativo: formData.ativo === "true"
    };

    if (!payload.nome || !payload.codigo || !payload.carga_horaria || !payload.semestre) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await DBDISCIPLINAS.post("/", payload);
      await recuperaDisciplinas();
      setFormData({
        curso: "",
        professor: "",
        nome: "",
        codigo: "",
        carga_horaria: "",
        semestre: "",
        descricao: "",
        ativo: "true"
      });
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
      alert("Falha ao cadastrar disciplina!");
    }
  }

  async function deletaDisciplina(id) {
    if (!window.confirm("Tem certeza que deseja deletar esta disciplina?")) return;

    try {
      await DBDISCIPLINAS.delete(`/${id}/`);
      await recuperaDisciplinas();
    } catch (err) {
      console.error("Erro ao deletar disciplina:", err);
      alert("Falha ao deletar disciplina!");
    }
  }

  async function atualizaDisciplina(id) {
    const nomeTrim = editNome.trim();
    if (!nomeTrim) return alert("Insira um nome válido!");

    try {
      await DBDISCIPLINAS.put(`/${id}/`, { nome: nomeTrim });
      setEditId(null);
      setEditNome("");
      await recuperaDisciplinas();
    } catch (err) {
      console.error("Erro ao atualizar disciplina:", err);
      alert("Falha ao atualizar disciplina!");
    }
  }

  useEffect(() => {
    recuperaDisciplinas();
  }, []);

  return (
    <div className="disciplinas-container">
      <h1>Gerenciar Disciplinas</h1>

      <h2>Cadastrar disciplina</h2>
      <form className="disciplinas-form" onSubmit={adicionaDisciplina}>
        <label>Cursos:</label>
        <input name="curso" value={formData.curso} onChange={handleChange} required />

        <label>Nome do Professor (opcional):</label>
        <input name="professor" value={formData.professor} onChange={handleChange} />

        <label>Nome da Disciplina:</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Código:</label>
        <input name="codigo" value={formData.codigo} onChange={handleChange} required />

        <label>Carga Horária (em horas):</label>
        <input type="number" name="carga_horaria" value={formData.carga_horaria} onChange={handleChange} required />

        <label>Semestre da disciplina (1–10):</label>
        <input type="number" name="semestre" value={formData.semestre} onChange={handleChange} required />

        <label>Descrição:</label>
        <textarea name="descricao" value={formData.descricao} onChange={handleChange} />

        <label>Ativo:</label>
        <select name="ativo" value={formData.ativo} onChange={handleChange}>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>

        <button type="submit">Adicionar disciplina</button>
      </form>

      <div className="disciplinas-list">
        <h3>Disciplinas Cadastradas</h3>
        <ul>
          {disciplinasCadastradas.map((d) => (
            <li key={d.id}>
              {editId === d.id ? (
                <>
                  <input
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                  <div className="btn-group">
                    <button onClick={() => atualizaDisciplina(d.id)}>Salvar</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{d.nome}</span>
                  <div className="btn-group">
                    <button
                      onClick={() => {
                        setEditId(d.id);
                        setEditNome(d.nome);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => deletaDisciplina(d.id)}>Deletar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Link to="/" className="voltar-btn">Voltar</Link>
    </div>
  );
}

export default Disciplinas;