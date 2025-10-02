// ListarCurso.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './Curso.css';
import { useNavigate } from "react-router-dom";


function ListarCurso() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const [cursos, setCursos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", duracao: "", tipocurso: "", coordenador: "" });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaCursos() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setCursos(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
    }
  }

  async function deletaCurso(id) {
    if (!window.confirm("Tem certeza que deseja deletar este curso?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaCursos();
    } catch (err) {
      console.error("Erro ao deletar curso:", err);
      alert("Falha ao deletar curso!");
    }
  }

  async function salvaEdicao(id) {
    try {
      await DB.put(`/${id}/`, {
        nome: editData.nome,
        duracao: parseInt(editData.duracao),
        tipocurso: editData.tipocurso,
        coordenador: editData.coordenador
      });
      setEditId(null);
      setEditData({ nome: "", duracao: "", tipocurso: "", coordenador: "" });
      await recuperaCursos();
    } catch (err) {
      console.error("Erro ao atualizar curso:", err);
      alert("Falha ao atualizar curso!");
    }
  }

  useEffect(() => {
    recuperaCursos();
  }, []);

  return (
    <div className="cursos-container">
      <h1 className="cursos-title">Listar Cursos</h1>
      <table className="cursos-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Duração</th>
            <th>Tipo</th>
            <th>Coordenador</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>
                {editId === curso.id ? 
                  <input name="nome" value={editData.nome} onChange={handleEditChange} /> : 
                  curso.nome
                }
              </td>
              <td>
                {editId === curso.id ? 
                  <input type="number" name="duracao" value={editData.duracao} onChange={handleEditChange} /> : 
                  curso.duracao
                }
              </td>
              <td>
                {editId === curso.id ? 
                  <select name="tipocurso" value={editData.tipocurso} onChange={handleEditChange}>
                    <option value="">Selecione</option>
                    <option value="SAE">superior_agroecologia</option>
                    <option value="SADS">superior_ads</option>
                    <option value="SEI">superior_eletronica_industrial</option>
                    <option value="SGDL">superior_gestao_desportiva_lazer</option>
                    <option value="SLPE">superior_letras_port_esp</option>
                    <option value="SPG">superior_processos_gerenciais</option>
                    <option value="TCS">tecnico_concomitante_subsequente</option>
                    <option value="TI">tecnico_integrado</option>
                    <option value="TP">tecnico_proeja</option>
                    <option value="TS">tecnico_subsequente</option>
                  </select> :
                  curso.tipocurso
                }
              </td>
              <td>
                {editId === curso.id ? 
                  <input name="coordenador" value={editData.coordenador} onChange={handleEditChange} /> : 
                  curso.coordenador
                }
              </td>
              <td className="btn-group">
                {editId === curso.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(curso.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => setEditId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(curso.id);
                      setEditData({
                        nome: curso.nome,
                        duracao: curso.duracao,
                        tipocurso: curso.tipocurso,
                        coordenador: curso.coordenador
                      });
                    }}>Editar</button>
                    <button className="btn-deletar" onClick={() => deletaCurso(curso.id)}>Deletar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button className="btn-salvar" onClick={() => navigate("/curso/cadastrar")}>
                Cadastrar Novo Curso
            </button>
        </div>
    </div>
  );
}

export default ListarCurso;
