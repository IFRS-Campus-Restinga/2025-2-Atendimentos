import { useEffect, useState } from "react";
import axios from "axios";
import "./Aluno.css";
import { useNavigate } from "react-router-dom";
import Paginacao from "../../components/Paginacao.jsx";

function ListarAluno() {
  const DB = axios.create({
    baseURL: "http://127.0.0.1:8000/services/alunos/",
  });

  const [alunos, setAlunos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    nome_completo: "",
    matricula: "",
    curso: "",
    turma: "",
    alunoPEI: false,
  });

  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditData((prev) => ({ ...prev, [name]: newValue }));
  }

  async function recuperaAlunos() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setAlunos(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  }

  async function deletaAluno(id) {
    if (!window.confirm("Tem certeza que deseja deletar este aluno?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaAlunos();
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
      alert("Falha ao deletar aluno!");
    }
  }

  async function salvaEdicaoAluno(id) {
    try {
      const payload = {
        ...editData,
        matricula: Number(editData.matricula),
      };

      await DB.put(`/${id}/`, payload);
      setEditId(null);
      setEditData({
        nome_completo: "",
        matricula: "",
        curso: "",
        turma: "",
        alunoPEI: false,
      });
      await recuperaAlunos();
    } catch (err) {
      console.error("Erro ao atualizar aluno:", err);
      alert("Falha ao atualizar aluno!");
    }
  }

  useEffect(() => {
    recuperaAlunos();
  }, []);

  return (
    <div className="alunos-container">
      <h1 className="alunos-title">Lista de Alunos</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/alunos/cadastrar")}>
          Cadastrar Novo Aluno
        </button>
      </div>

      {/* Paginação */}
      <Paginacao itens={alunos} itensPorPagina={10}>
        {(alunosPaginaAtual) => (
          <table className="alunos-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>Turma</th>
                <th>PEI</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosPaginaAtual.map((aluno) => (
                <tr key={aluno.id}>
                  <td>
                    {editId === aluno.id ? (
                      <input
                        name="nome_completo"
                        value={editData.nome_completo}
                        onChange={handleEditChange}
                      />
                    ) : (
                      aluno.nome_completo
                    )}
                  </td>
                  <td>
                    {editId === aluno.id ? (
                      <input
                        name="matricula"
                        type="text"
                        value={editData.matricula}
                        onChange={handleEditChange}
                      />
                    ) : (
                      aluno.matricula
                    )}
                  </td>
                  <td>
                    {editId === aluno.id ? (
                      <input
                        name="curso"
                        value={editData.curso}
                        onChange={handleEditChange}
                      />
                    ) : (
                      aluno.curso
                    )}
                  </td>
                  <td>
                    {editId === aluno.id ? (
                      <input
                        name="turma"
                        value={editData.turma}
                        onChange={handleEditChange}
                      />
                    ) : (
                      aluno.turma
                    )}
                  </td>
                  <td>
                    {editId === aluno.id ? (
                      <input
                        name="alunoPEI"
                        type="checkbox"
                        checked={editData.alunoPEI}
                        onChange={handleEditChange}
                      />
                    ) : aluno.alunoPEI ? (
                      <span className="status-ativo">Sim</span>
                    ) : (
                      <span className="status-inativo">Não</span>
                    )}
                  </td>
                  <td className="btn-group">
                    {editId === aluno.id ? (
                      <>
                        <button className="btn-salvar" onClick={() => salvaEdicaoAluno(aluno.id)}>
                          Salvar
                        </button>
                        <button className="btn-cancelar" onClick={() => setEditId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-editar"
                          onClick={() => {
                            setEditId(aluno.id);
                            setEditData({
                              nome_completo: aluno.nome_completo,
                              matricula: aluno.matricula.toString(),
                              curso: aluno.curso,
                              turma: aluno.turma,
                              alunoPEI: aluno.alunoPEI,
                            });
                          }}
                        >
                          Editar
                        </button>
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

export default ListarAluno;
