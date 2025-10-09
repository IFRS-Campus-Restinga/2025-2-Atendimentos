import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// App.jsx
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import './index.css';

import CadastrarCurso from './pages/Curso/CadastrarCurso.jsx';
import ListarCurso from './pages/Curso/ListarCurso.jsx';
import CadastrarTurma from './pages/Turma/CadastrarTurma.jsx';
import ListarTurma from './pages/Turma/ListarTurma.jsx';
import CadastraCoordenador from './pages/Coordenador/CadastraCoordenador.jsx';
import ListarCoordenador from './pages/Coordenador/ListarCoordenador.jsx';
import ListarAluno from './pages/Aluno/ListarAluno.jsx';
import CadastraAluno from './pages/Aluno/CadastraAluno';
import ListarProfessor from './pages/Professor/ListarProfessor.jsx';
import CadastraProfessor from './pages/Professor/CadastraProfessor';
import ListarDisciplina from './pages/Disciplina/ListarDisciplina.jsx';
import CadastrarDisciplina from './pages/Disciplina/CadastrarDisciplina.jsx';
import Agenda from './pages/Agenda/Agenda.jsx';
 

function App() {
  const [usuario, setUsuario] = useState(null);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    const tokenSalvo = localStorage.getItem("token");
    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setLogado(true);
    }
  }, []);

  const sucessoLoginGoogle = async (credentialResponse) => {
    try {
      const dados = jwtDecode(credentialResponse.credential);
      const userData = {
        email: dados.email,
        nome: dados.name,
        foto: dados.picture
      };

      setUsuario(userData);
      setLogado(true);
      localStorage.setItem("usuario", JSON.stringify(userData));
      localStorage.setItem("token", credentialResponse.credential);

      const response = await fetch("http://127.0.0.1:8000/api/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: dados.email }) // envia email, não token
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok && data.token) {
          localStorage.setItem("authToken", data.token);
        } else {
          console.error("Erro ao validar token no backend:", data);
          //alert("Falha na autenticação com o servidor.");
        }
      } else {
        const text = await response.text();
        console.error("Resposta inesperada do backend:", text);
        //alert("Erro inesperado ao autenticar.");
      }
    } catch (erro) {
      console.error("Erro ao decodificar token do Google:", erro);
      logout();
    }
  };

  const erroLoginGoogle = () => {
    console.error('Falha no login com o Google');
    logout();
  };

  const logout = () => {
    setUsuario(null);
    setLogado(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
  };

  const RotaProtegida = ({ children }) => {
    const location = useLocation();
    if (!logado && location.pathname !== "/") {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        {logado && (
          <>
            <Header usuario={usuario} onLogout={logout} />
            <hr />
          </>
        )}
        <Routes>
          <Route
            path="/"
            element={
              logado ? (
                <Navigate to="/appointments" />
              ) : (
                <Login
                  onLoginSuccess={sucessoLoginGoogle}
                  onLoginError={erroLoginGoogle}
                  logado={logado}
                  usuario={usuario}
                />
              )
            }
          />
          <Route path="/appointments" element={<RotaProtegida><h1>Página de Atendimentos</h1></RotaProtegida>} />
          <Route path="/disciplina" element={<RotaProtegida><ListarDisciplina /></RotaProtegida>} />
          <Route path="/disciplina/cadastrar" element={<RotaProtegida><CadastrarDisciplina /></RotaProtegida>} />
          <Route path="/curso" element={<RotaProtegida><ListarCurso /></RotaProtegida>} />
          <Route path="/curso/cadastrar" element={<RotaProtegida><CadastrarCurso /></RotaProtegida>} />
          <Route path="/turma" element={<RotaProtegida><ListarTurma /></RotaProtegida>} />
          <Route path="/turma/cadastrar" element={<RotaProtegida><CadastrarTurma /></RotaProtegida>} />
          <Route path="/coord" element={<RotaProtegida><ListarCoordenador /></RotaProtegida>} />
          <Route path="/coord/cadastrar" element={<RotaProtegida><CadastraCoordenador /></RotaProtegida>} />
          <Route path="/alunos" element={<RotaProtegida><ListarAluno /></RotaProtegida>} />
          <Route path="/alunos/cadastrar" element={<RotaProtegida><CadastraAluno /></RotaProtegida>} />
          <Route path="/professores" element={<RotaProtegida><ListarProfessor /></RotaProtegida>} />
          <Route path="/professores/cadastrar" element={<RotaProtegida><CadastraProfessor /></RotaProtegida>} />
          <Route path="/agenda" element={<RotaProtegida><Agenda /></RotaProtegida>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;