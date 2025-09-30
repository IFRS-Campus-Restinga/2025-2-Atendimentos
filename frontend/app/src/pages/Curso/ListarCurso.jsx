// ListarCurso.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './Curso.css';
import { useNavigate } from "react-router-dom";


function ListarCurso() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const [cursos, setCursos] = useState([]);
  const [editId, setEditId] = useState(null);
<<<<<<< HEAD
  const [editData, setEditData] = useState({ nome: "", duracao: "", tipocurso: "", coordenador: "" });
=======
  const [editData, setEditData] = useState({ nome: "", codigo: "", });
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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

<<<<<<< HEAD
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

=======
async function salvaEdicao(id) {
    try {
      await DB.patch(`/${id}/`, {
        nome: editData.nome,
        codigo: editData.codigo
      });
      setEditId(null);
      setEditData({ nome: "", codigo: "" });
      await recuperaCursos();
    } catch (err) {
      console.error("Erro ao atualizar curso:", err);
    }
  }

  function capitalizarPrimeiraLetra(texto) {
  texto = texto.replace(/_/g, ' ');           
  texto = texto.toLowerCase();                
  texto = texto.charAt(0).toUpperCase() + texto.slice(1); 
  return texto;
  }

>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
  useEffect(() => {
    recuperaCursos();
  }, []);

  return (
    <div className="cursos-container">
<<<<<<< HEAD
      <h1 className="cursos-title">Listar Cursos</h1>
=======
      <h1 className="cursos-title">Lista de Cursos</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button className="btn-salvar" onClick={() => navigate("/curso/cadastrar")}>
                Cadastrar Novo Curso
            </button>
        </div>
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
      <table className="cursos-table">
        <thead>
          <tr>
            <th>Nome</th>
<<<<<<< HEAD
            <th>Duração</th>
            <th>Tipo</th>
=======
            <th>Código</th>
            <th>Tipo do Curso</th>
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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
<<<<<<< HEAD
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
=======
                  <input name="codigo" value={editData.codigo} onChange={handleEditChange} /> : 
                  curso.codigo
                }
              </td>
              <td>{capitalizarPrimeiraLetra(curso.tipo_curso)}</td>
              <td>{curso.coordenador?.email || "—"}</td>
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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
<<<<<<< HEAD
                        duracao: curso.duracao,
                        tipocurso: curso.tipocurso,
                        coordenador: curso.coordenador
=======
                        codigo: curso.codigo
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
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
<<<<<<< HEAD
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button className="btn-salvar" onClick={() => navigate("/curso/cadastrar")}>
                Cadastrar Novo Curso
            </button>
        </div>
=======
>>>>>>> 626478a657c38b2393702f90d64c6b3b5d74365e
    </div>
  );
}

export default ListarCurso;
