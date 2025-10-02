import { useEffect, useState } from "react";
import axios from "axios";
import "./Aluno.css";
import { useNavigate } from "react-router-dom";

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
  });
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
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
      
      await DB.put(`/${id}/`, {
        nome_completo: editData.nome_completo,
        matricula: editData.matricula,
        curso: editData.curso,
        turma: editData.turma,
        alunoPEI: editData.alunoPEI, 
      });
      setEditData({ nome_completo: "", matricula: "", curso: "", turma: "" });
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
      {" "}
      
      <h1 className="alunos-title">Lista de Alunos</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
       
        <button
          className="btn-salvar"
          onClick={() => navigate("/alunos/cadastrar")}
        >
          Cadastrar Novo Aluno{" "}
        </button>
      </div>
      <table className="alunos-table">
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Matrícula</th> 
            <th>Curso</th> 
            <th>Turma</th> 
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
        
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>
                {
                  editId === aluno.id ? (
                    <input
                      name="nome_completo"
                      value={editData.nome_completo}
                      onChange={handleEditChange}
                    />
                  ) : (
                    aluno.nome_completo
                  ) 
                }
              </td>
              <td>
                {
                  editId === aluno.id ? (
                    <input
                      name="matricula"
                      value={editData.matricula}
                      onChange={handleEditChange}
                    />
                  ) : (
                    aluno.matricula
                  ) 
                }
              </td>
              <td>{aluno.curso}</td>
              <td>{aluno.turma}</td> 
              <td className="btn-group">
                {editId === aluno.id ? (
                  <>
                    <button
                      className="btn-salvar"
                      onClick={() => salvaEdicaoAluno(aluno.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className="btn-cancelar"
                      onClick={() => setEditId(null)}
                    >
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
                          matricula: aluno.matricula,
                          curso: aluno.curso,
                          turma: aluno.turma,
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-deletar"
                      onClick={() => deletaAluno(aluno.id)}
                    >
                      Deletar
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
}

export default ListarAluno;
