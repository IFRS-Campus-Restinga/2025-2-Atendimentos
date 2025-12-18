import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Atendimento.css";

const ListaAtendimentosEscolares = () => {

  const navigate = useNavigate();

  const DB = axios.create({
    baseURL: "http://127.0.0.1:8000/services/atendimentos-escolares",
  });

  const [atendimentos, setAtendimentos] = useState([]);
  const [busca, setBusca] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  async function carregarAtendimentos() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setAtendimentos(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar atendimentos:", err);
    }
  }

  const atendimentosFiltrados = atendimentos.filter((item) =>
    item.titulo?.toLowerCase().includes(busca.toLowerCase())
  );

  const iniciarEdicao = (item) => {
    setEditId(item.id);
    setEditData({
      titulo: item.titulo,
      data: item.data,
      hora_inicio: item.hora_inicio,
      hora_fim: item.hora_fim,
      status: item.status,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  

  async function salvarEdicao(id) {
    try {
      await DB.patch(`/${id}/`, editData);
      setEditId(null);
      setEditData({});
      carregarAtendimentos();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
    }
  }

  const cancelarEdicao = () => {
    setEditId(null);
    setEditData({});
  };

  async function excluirAtendimento(id) {
    if (!window.confirm("Deseja excluir este atendimento?")) return;

    try {
      await DB.delete(`/${id}/`);
      carregarAtendimentos();
    } catch (err) {
      console.error("Erro ao excluir atendimento:", err);
    }
  }

  return (
    <div className="pagina-atendimentos">
      <h2 className="titulo-pagina">Atendimentos Escolares</h2>

        <div className="acoes-topo">
            <button
                className="botao-novo-atendimento"
                onClick={() => navigate("/atendimentos/cadastrar")}
            >
                + Novo Atendimento
            </button>
        </div>

      <input
        type="text"
        className="input-busca"
        placeholder="Buscar por título"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <table className="tabela-atendimentos">
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atendimentosFiltrados.length === 0 && (
            <tr>
              <td colSpan="5">Nenhum atendimento encontrado</td>
            </tr>
          )}

          {atendimentosFiltrados.map((item) => (
            <tr key={item.id}>
              <td>
                {editId === item.id ? (
                  <input
                    name="titulo"
                    value={editData.titulo}
                    onChange={handleChange}
                  />
                ) : (
                  item.titulo
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <input
                    type="date"
                    name="data"
                    value={editData.data}
                    onChange={handleChange}
                  />
                ) : (
                  item.data
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={editData.hora_inicio}
                      onChange={handleChange}
                    />
                    {" - "}
                    <input
                      type="time"
                      name="hora_fim"
                      value={editData.hora_fim}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  `${item.hora_inicio} - ${item.hora_fim}`
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleChange}
                  >
                    <option value="AGENDADO">Agendado</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="REALIZADO">Realizado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                ) : (
                  item.status
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <>
                    <button onClick={() => salvarEdicao(item.id)}>
                      Salvar
                    </button>
                    <button onClick={cancelarEdicao}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="botao-editar"
                      onClick={() => iniciarEdicao(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="botao-excluir"
                      onClick={() => excluirAtendimento(item.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAtendimentosEscolares;
