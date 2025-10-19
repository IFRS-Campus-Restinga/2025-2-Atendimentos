import { useEffect, useState } from "react";
import axios from "axios";
import './Turma.css';
import { useNavigate } from "react-router-dom";
import Paginacao from "../../components/Paginacao.jsx";


function ListarTurma() {
  const DB = axios.create({ baseURL: 'http://127.0.0.1:8000/services/turmas' });
  const [turmas, setTurmas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    semestre: "",
    ano: "",
    turno: "",
  });
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  function turnoPorExtenso(sigla) {
    const turnos = { M: "Manhã", T: "Tarde", N: "Noite" };
    return turnos[sigla] || sigla;
  }

  function cursoEhSuperOuProeja(turma) {
    const tipo = turma.curso?.tipo_curso;
    return tipo === "SUPERIOR" || tipo === "PROEJA";
  }

  async function recuperaTurmas() {
    try {
      const response = await DB.get("/");
      const data = response.data;
      setTurmas(Array.isArray(data) ? data : data.results);
    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
    }
  }

  async function recuperaCursos() {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/services/cursos/');
      const d = resp.data;
      setCursos(Array.isArray(d) ? d : d.results);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
    }
  }

  async function deletaTurma(id) {
    if (!window.confirm("Tem certeza que deseja deletar esta turma?")) return;
    try {
      await DB.delete(`/${id}/`);
      await recuperaTurmas();
    } catch (err) {
      console.error("Erro ao deletar turma:", err);
      alert("Falha ao deletar turma!");
    }
  }

  async function salvaEdicao(id) {
    try {
      const payload = {
        nome: editData.nome,
        turno: editData.turno,
        curso: parseInt(editData.curso)
      };

      if (editData.semestre !== "") {
        payload.semestre = parseInt(editData.semestre);
        payload.ano = null;
      } else if (editData.ano !== "") {
        payload.ano = parseInt(editData.ano);
        payload.semestre = null;
      }

      await DB.patch(`/${id}/`, payload);
      setEditId(null);
      setEditData({ nome: "", semestre: "", ano: "", turno: "" });
      await recuperaTurmas();
    } catch (err) {
      console.error("Erro ao atualizar turma:", err);
      alert("Falha ao atualizar turma!");
    }
  }

  function capitalizarPrimeiraLetra(texto) {
    texto = texto.replace(/_/g, ' ');
    texto = texto.toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  useEffect(() => {
    recuperaTurmas();
    recuperaCursos();
  }, []);

  return (
    <div className="turmas-container">
      <h1 className="turmas-title">Lista de Turmas</h1>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="btn-salvar" onClick={() => navigate("/turma/cadastrar")}>
          Cadastrar Nova Turma
        </button>
      </div>

      {/* Componente de Paginação */}
      <Paginacao itens={turmas} itensPorPagina={10}>
        {itensPaginaAtual => (
          <table className="turmas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Semestre / Ano</th>
                <th>Turno</th>
                <th>Curso</th>
                <th>Coordenador</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensPaginaAtual.map(turma => {
                const curso = turma.curso || {};
                const coordenador = curso.coordenador || {};
                const mostraSemestre = cursoEhSuperOuProeja(turma);

                return (
                  <tr key={turma.id}>
                    <td>
                      {editId === turma.id ? (
                        <input name="nome" value={editData.nome} onChange={handleEditChange} />
                      ) : turma.nome}
                    </td>
                    <td>
                      {editId === turma.id ? (
                        mostraSemestre ? (
                          <input name="semestre" value={editData.semestre} onChange={handleEditChange} placeholder="Semestre" />
                        ) : (
                          <input name="ano" value={editData.ano} onChange={handleEditChange} placeholder="Ano" />
                        )
                      ) : mostraSemestre ? turma.semestre : turma.ano}
                    </td>
                    <td>
                      {editId === turma.id ? (
                        <select name="turno" value={editData.turno} onChange={handleEditChange}>
                          <option value="">Selecione</option>
                          <option value="M">Manhã</option>
                          <option value="T">Tarde</option>
                          <option value="N">Noite</option>
                        </select>
                      ) : turnoPorExtenso(turma.turno)}
                    </td>
                    <td>{curso.codigo}, {capitalizarPrimeiraLetra(curso.tipo_curso)}</td>
                    <td>{coordenador.email || "-"}</td>
                    <td className="btn-group">
                      {editId === turma.id ? (
                        <>
                          <button className="btn-salvar" onClick={() => salvaEdicao(turma.id)}>Salvar</button>
                          <button className="btn-cancelar" onClick={() => { setEditId(null); setEditData({ nome: "", semestre: "", ano: "", turno: "" }); }}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-editar" onClick={() => { setEditId(turma.id); setEditData({ nome: turma.nome, turno: turma.turno, semestre: turma.semestre ?? "", ano: turma.ano ?? "" }); }}>Editar</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Paginacao>
    </div>
  );
}

//<button className="btn-deletar" onClick={() => deletaTurma(turma.id)}>Deletar</button>
export default ListarTurma;
