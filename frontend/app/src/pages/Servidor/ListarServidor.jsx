import { useEffect, useState } from "react";
import axios from "axios";
import './Servidor.css';
import { useNavigate } from "react-router-dom";

function ListarServidor() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/servidores' });

  const [servidores, setServidores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ 
    nome: "", 
    email: "", 
    registro: "", 
    servidor: ""
  });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaServidores() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setServidores(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao buscar servidores:", err);
      alert("Falha ao carregar a lista de servidores!");
    }
  }

  async function deletaServidor(id) {
    if (!window.confirm("Tem certeza que deseja deletar este servidor?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaServidores();
      alert("Servidor deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar servidor:", err);
      alert("Falha ao deletar servidor!");
    }
  }

  async function salvaEdicao(id) {
    if (!editData.nome || !editData.email || !editData.registro || !editData.servidor) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }

    try {
      await DB.patch(`/${id}/`, {
        nome: editData.nome,
        email: editData.email,
        registro: editData.registro,
        servidor: editData.servidor,
      });
      setEditId(null);
      setEditData({ nome: "", email: "", registro: "", servidor: "" });
      await recuperaServidores();
      alert("Servidor atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar servidor:", err.response ? err.response.data : err.message);
      alert("Falha ao atualizar servidor! Verifique os dados e o formato do email/registro.");
    }
  }

  useEffect(() => {
    recuperaServidores();
  }, []);

  return (
    <div className="servidores-container">
      <h1 className="servidores-title">Lista de Servidores</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/servidores/cadastrar")}>
          Cadastrar Novo Servidor
        </button>
      </div>
      <table className="servidores-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Registro</th>
            <th>Servidor/Disciplina</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servidores.map(servidor => (
            <tr key={servidor.id}>
              <td>{servidor.id}</td>
              
              <td>
                {editId === servidor.id ?
                  <input
                    name="nome"
                    value={editData.nome}
                    onChange={handleEditChange}
                    maxLength={100}
                  /> :
                  servidor.nome
                }
              </td>

              <td>
                {editId === servidor.id ?
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                  /> :
                  servidor.email
                }
              </td>

              <td>
                {editId === servidor.id ?
                  <input
                    name="registro"
                    value={editData.registro}
                    onChange={handleEditChange}
                    maxLength={20}
                  /> :
                  servidor.registro
                }
              </td>
              
              <td>
                {editId === servidor.id ?
                  <input
                    name="servidor"
                    value={editData.servidor}
                    onChange={handleEditChange}
                    maxLength={30}
                  /> :
                  servidor.servidor
                }
              </td>

              <td className="btn-group">
                {editId === servidor.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(servidor.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => setEditId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(servidor.id);
                      setEditData({
                        nome: servidor.nome,
                        email: servidor.email,
                        registro: servidor.registro,
                        servidor: servidor.servidor,
                      });
                    }}>Editar</button>
                    <button className="btn-deletar" onClick={() => deletaServidor(servidor.id)}>Deletar</button>
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

export default ListarServidor;