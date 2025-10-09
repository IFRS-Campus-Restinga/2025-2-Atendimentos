import { useEffect, useState } from "react";
import axios from "axios";
import './RegistroAtendimento.css';
import { useNavigate } from "react-router-dom";

function ListarRegistro() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/registros' });
  const [registros, setRegistros] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    data_atendimento: "",
    descricao: ""
  });

  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  async function recuperaRegistros() {
    try {
      const response = await DB.get("/");
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setRegistros(data);
    } catch (err) {
      console.error("Erro ao buscar registros:", err);
    }
  }

  async function deletaRegistro(id) {
    if (!window.confirm("Tem certeza que deseja deletar este registro?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaRegistros();
    } catch (err) {
      console.error("Erro ao deletar registro:", err);
      alert("Falha ao deletar registro!");
    }
  }

  async function salvaEdicao(id) {
    try {
      const payload = {
        data_atendimento: editData.data_atendimento,
        descricao: editData.descricao.trim()
      };
      await DB.patch(`/${id}/`, payload);
      setEditId(null);
      setEditData({ data_atendimento: "", descricao: "" });
      await recuperaRegistros();
    } catch (err) {
      console.error("Erro ao atualizar registro:", err);
      alert("Falha ao atualizar registro!");
    }
  }

  function formataDataHora(datetimeStr) {
    if (!datetimeStr) return "-";
    const dt = new Date(datetimeStr);
    return dt.toLocaleString();
  }

  useEffect(() => {
    recuperaRegistros();
  }, []);

  return (
    <div className="registros-container">
      <h1 className="registros-title">Lista de Registros de Atendimento</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/registros/cadastrar")}>
          Cadastrar Novo Registro
        </button>
      </div>

      <table className="registros-table">
        <thead>
          <tr>
            <th>Turma</th>
            <th>Tipo Atendimento</th>
            <th>Data/Hora do Atendimento</th>
            <th>Data do Registro</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(registro => (
            <tr key={registro.id}>
              <td>{registro.turma_nome || "-"}</td>
              <td>{registro.tipo_atendimento || "-"}</td>
              <td>{formataDataHora(registro.data_hora_atendimento)}</td>
              <td>
                {editId === registro.id ? (
                  <input
                    type="datetime-local"
                    name="data_atendimento"
                    value={editData.data_atendimento}
                    onChange={handleEditChange}
                  />
                ) : (
                  formataDataHora(registro.data_atendimento)
                )}
              </td>
              <td>
                {editId === registro.id ? (
                  <input
                    type="text"
                    name="descricao"
                    value={editData.descricao}
                    onChange={handleEditChange}
                  />
                ) : (
                  registro.descricao
                )}
              </td>
              <td className="btn-group">
                {editId === registro.id ? (
                  <>
                    <button className="btn-salvar" onClick={() => salvaEdicao(registro.id)}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => {
                      setEditId(null);
                      setEditData({ data_atendimento: "", descricao: "" });
                    }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-editar" onClick={() => {
                      setEditId(registro.id);
                      setEditData({
                        data_atendimento: registro.data_atendimento ?? "",
                        descricao: registro.descricao ?? ""
                      });
                    }}>Editar</button>
                    <button className="btn-deletar" onClick={() => deletaRegistro(registro.id)}>Deletar</button>
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

export default ListarRegistro;
