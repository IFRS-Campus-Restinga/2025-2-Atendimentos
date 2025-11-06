import { useEffect, useState } from "react";
import axios from "axios";
import './Curso.css';
import { useNavigate } from "react-router-dom";
import Paginacao from "../../components/Paginacao.jsx"; // importar componente de paginação

function ListarCurso() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/cursos' });
  const [cursos, setCursos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", codigo: "" });
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
    return texto.charAt(0).toUpperCase() + texto.slice(1); 
  }

  useEffect(() => {
    recuperaCursos();
  }, []);

  return (
    <div className="cursos-container">
      <h1 className="cursos-title">Lista de Cursos</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/curso/cadastrar")}>
          Cadastrar Novo Curso
        </button>
      </div>

      <Paginacao itens={cursos} itensPorPagina={10}>
        {itensPaginaAtual => (
          <table className="cursos-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Código</th>
                <th>Tipo do Curso</th>
                <th>Coordenador</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensPaginaAtual.map(curso => (
                <tr key={curso.id}>
                  <td>
                    {editId === curso.id ? 
                      <input name="nome" value={editData.nome} onChange={handleEditChange} /> : 
                      curso.nome
                    }
                  </td>
                  <td>
                    {editId === curso.id ? 
                      <input name="codigo" value={editData.codigo} onChange={handleEditChange} /> : 
                      curso.codigo
                    }
                  </td>
                  <td>{capitalizarPrimeiraLetra(curso.tipo_curso)}</td>
                  <td>{curso.coordenador?.email || "—"}</td>
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
                            codigo: curso.codigo
                          });
                        }}>Editar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paginacao>
    </div>
  );
}

export default ListarCurso;
