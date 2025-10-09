import { useEffect, useState } from "react";
import axios from "axios";
import './Professor.css';
import { useNavigate } from "react-router-dom";

function ListarProfessor() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/professores' });
  
  const [professores, setProfessores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ registro: "", disciplina: "" });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaProfessores() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setProfessores(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      alert("Falha ao carregar a lista de professores!");
    }
  }

  async function deletaProfessor(id) {
    if (!window.confirm("Tem certeza que deseja deletar este professor?")) return;
    try {
      await DB.delete(`/${id}/`); 
      await recuperaProfessores();
      alert("Professor deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar professor:", err);
      alert("Falha ao deletar professor!");
    }
  }

  async function salvaEdicao(id) {
    try {
      await DB.put(`/${id}/`, { 
        registro: editData.registro,
        disciplina: editData.disciplina,
      });
      setEditId(null);
      setEditData({ registro: "", disciplina: "" });
      await recuperaProfessores(); 
      alert("Professor atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar professor:", err.response ? err.response.data : err.message);
      alert("Falha ao atualizar professor! Verifique os dados.");
    }
  }

  useEffect(() => {
    recuperaProfessores();
  }, []);

  return (
    <div className="coordenadores-container"> 
      <h1 className="coordenadores-title">Lista de Professores</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/professores/cadastrar")}>
          Cadastrar Novo Professor
        </button>
      </div>
      <table className="coordenadores-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Registro</th>
            <th>Disciplina</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {professores.map(professor => (
            <tr key={professor.id}>
              <td>{professor.id}</td>
              <td>
                {editId === professor.id ?
                  <input 
                    name="registro" 
                    value={editData.registro} 
                    onChange={handleEditChange} 
                    maxLength={20}
                  /> :
                  professor.registro
                }
              </td>
              <td>
                {editId === professor.id ?
                  <input 
                    name="disciplina" 
                    value={editData.disciplina} 
                    onChange={handleEditChange} 
                    maxLength={100}
                  /> :
                  professor.disciplina
                }
              </td>
              <td className="btn-group">
                {editId === professor.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(professor.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => setEditId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(professor.id);
                      setEditData({
                        registro: professor.registro,
                        disciplina: professor.disciplina,
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
//<button className="btn-deletar" onClick={() => deletaProfessor(professor.id)}>Deletar</button>
export default ListarProfessor;