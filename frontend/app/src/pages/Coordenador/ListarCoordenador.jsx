import { useEffect, useState } from "react";
import axios from "axios";
import './Coordenador.css';
import { useNavigate } from "react-router-dom";
import Paginacao from "../../components/Paginacao.jsx"; // import do componente

function ListarCoordenador() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/coord' });
  const [coordenadores, setCoordenadores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", registro: "" });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaCoordenadores() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setCoordenadores(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar coordenadores:", err);
    }
  }

  async function deletaCoordenador(id) {
    if (!window.confirm("Tem certeza que deseja deletar este coordenador?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaCoordenadores();
    } catch (err) {
      console.error("Erro ao deletar coordenador:", err);
      alert("Falha ao deletar coordenador!");
    }
  }

  async function salvaEdicao(id) {
    try {
      await DB.put(`/${id}/`, {
        nome: editData.nome,
        registro: editData.registro,
        email: editData.email,
        tipoPerfil: "COORD"
      });
      setEditId(null);
      setEditData({ nome: "", email: "", registro: "" });
      await recuperaCoordenadores();
    } catch (err) {
      console.error("Erro ao atualizar coordenador:", err);
      alert("Falha ao atualizar coordenador!");
    }
  }

  useEffect(() => {
    recuperaCoordenadores();
  }, []);

  return (
    <div className="coordenadores-container">
      <h1 className="coordenadores-title">Lista de Coordenadores</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/coord/cadastrar")}>
          Cadastrar Novo Coordenador
        </button>
      </div>

      <Paginacao itens={coordenadores} itensPorPagina={10}>
        {itensPaginaAtual => (
          <table className="coordenadores-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Registro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensPaginaAtual.map(coord => (
                <tr key={coord.id}>
                  <td>
                    {editId === coord.id ?
                      <input name="nome" value={editData.nome} onChange={handleEditChange} /> :
                      coord.nome
                    }
                  </td>
                  <td>{coord.email}</td>
                  <td>
                    {editId === coord.id ?
                      <input name="registro" value={editData.registro} onChange={handleEditChange} /> :
                      coord.registro
                    }
                  </td>
                  <td className="btn-group">
                    {editId === coord.id ? (
                      <>
                        <button className="btn-salvar" onClick={() => salvaEdicao(coord.id)}>Salvar</button>
                        <button className="btn-cancelar" onClick={() => setEditId(null)}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-editar" onClick={() => {
                          setEditId(coord.id);
                          setEditData({
                            nome: coord.nome,
                            registro: coord.registro,
                            email: coord.email
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

export default ListarCoordenador;
