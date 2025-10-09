import { useEffect, useState } from "react";
import axios from "axios";
import './Disciplina.css';
import { useNavigate } from "react-router-dom";

function ListarDisciplina() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/disciplinas' });
  const [disciplinas, setDisciplinas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    codigo:"",
    ativo: "true"
  });

  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaDisciplinas() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setDisciplinas(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar disciplinas:", err);
    }
  }

  async function deletaDisciplina(id) {
    if (!window.confirm("Tem certeza que deseja deletar esta disciplina?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaDisciplinas();
    } catch (err) {
      console.error("Erro ao deletar disciplina:", err);
      alert("Falha ao deletar disciplina!");
    }
  }

  async function salvaEdicao(id) {
    const nomeTrim = editData.nome.trim();
    if (!nomeTrim || nomeTrim.length > 50) {
      alert("Nome é obrigatório e deve ter no máximo 50 caracteres.");
      return;
    }

    try {
      const payload = {
        nome: nomeTrim,
        ativo: editData.ativo === "true"
      };

      await DB.patch(`/${id}/`, payload);
      setEditId(null);
      setEditData({ nome: "", ativo: "true" });
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
      <h1 className="disciplinas-title">Lista de Disciplinas</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/disciplina/cadastrar")}>
          Cadastrar Nova Disciplina
        </button>
      </div>
      <table className="disciplinas-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map(d => (
            <tr key={d.id}>
              <td>
                {editId === d.id ? (
                  <input
                    name="nome"
                    value={editData.nome}
                    onChange={handleEditChange}
                    maxLength={50}
                  />
                ) : (
                  d.nome
                )}
              </td>
              <td>{d.codigo}</td>
              <td>
                {editId === d.id ? (
                  <select name="ativo" value={editData.ativo} onChange={handleEditChange}>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                ) : (
                  d.ativo ? "Sim" : "Não"
                )}
              </td>
              <td className="btn-group">
                {editId === d.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(d.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => {
                      setEditId(null);
                      setEditData({ nome: "", ativo: "true" });
                    }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(d.id);
                      setEditData({
                        nome: d.nome,
                        ativo: d.ativo ? "true" : "false"
                      });
                    }}>Editar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//<button className="btn-deletar" onClick={() => deletaDisciplina(d.id)}>Deletar</button>
export default ListarDisciplina;