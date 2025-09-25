// ListarTurma.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './Turma.css'; // pode usar o mesmo CSS do curso, alterando nomes se quiser
import { useNavigate } from "react-router-dom";

function ListarTurma() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/turmas' });
  const [turmas, setTurmas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", periodo: "", turno: "", curso: "" });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaTurmas() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setTurmas(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
    }
  }

  async function deletaTurma(id) {
    if (!window.confirm("Tem certeza que deseja deletar esta turma?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaTurmas();
    } catch (err) {
      console.error("Erro ao deletar turma:", err);
      alert("Falha ao deletar turma!");
    }
  }

  async function salvaEdicao(id) {
    try {
      await DB.put(`/${id}/`, {
        nome: editData.nome,
        periodo: editData.periodo,
        turno: editData.turno,
        curso: parseInt(editData.curso)
      });
      setEditId(null);
      setEditData({ nome: "", periodo: "", turno: "", curso: "" });
      await recuperaTurmas();
    } catch (err) {
      console.error("Erro ao atualizar turma:", err);
      alert("Falha ao atualizar turma!");
    }
  }

  useEffect(() => {
    recuperaTurmas();
  }, []);

  return (
    <div className="turmas-container">
      <h1 className="turmas-title">Listar Turmas</h1>
      <table className="turmas-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Período</th>
            <th>Turno</th>
            <th>Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map(turma => (
            <tr key={turma.id}>
              <td>
                {editId === turma.id ?
                  <input name="nome" value={editData.nome} onChange={handleEditChange} /> :
                  turma.nome
                }
              </td>
              <td>
                {editId === turma.id ?
                  <input name="periodo" value={editData.periodo} onChange={handleEditChange} /> :
                  turma.periodo
                }
              </td>
              <td>
                {editId === turma.id ?
                  <input name="turno" value={editData.turno} onChange={handleEditChange} /> :
                  turma.turno
                }
              </td>
              <td>
                {editId === turma.id ?
                  <input name="curso" value={editData.curso} onChange={handleEditChange} /> :
                  turma.curso_nome || turma.curso // exibe nome do curso, dependendo do JSON
                }
              </td>
              <td className="btn-group">
                {editId === turma.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(turma.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => setEditId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(turma.id);
                      setEditData({
                        nome: turma.nome,
                        periodo: turma.periodo,
                        turno: turma.turno,
                        curso: turma.curso // id do curso
                      });
                    }}>Editar</button>
                    <button className="btn-deletar" onClick={() => deletaTurma(turma.id)}>Deletar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/turma/cadastrar")}>
          Cadastrar Nova Turma
        </button>
      </div>
    </div>
  );
}

export default ListarTurma;
