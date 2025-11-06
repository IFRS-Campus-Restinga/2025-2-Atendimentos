import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getApiUrl } from "./services/api.js";
// App.jsx
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import RoleSelection from './pages/RoleSelection.jsx';
import CompletarCadastro from './pages/Onboarding/CompletarCadastro.jsx';
import DashboardAluno from './pages/Aluno/DashboardAluno.jsx';
import DashboardProfessor from './pages/Professor/DashboardProfessor.jsx';
import DashboardCoordenador from './pages/Coordenador/DashboardCoordenador.jsx';
import NotAvailable from './pages/NotAvailable.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
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
import ListarRegistro from './pages/RegistroAtendimento/ListarRegistro.jsx';
import CadastrarRegistroAtendimento from './pages/RegistroAtendimento/CadastrarRegistro.jsx';
import ListarDisciplina from './pages/Disciplina/ListarDisciplina.jsx';
import CadastrarDisciplina from './pages/Disciplina/CadastrarDisciplina.jsx';
import Agenda from './pages/Agenda/Agenda.jsx';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    const tokenSalvo = localStorage.getItem("authToken");
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
      // Não armazene o idToken do Google; usaremos apenas o token do backend
      localStorage.removeItem('selectedRole');

      const response = await fetch(getApiUrl('googleLogin'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          console.error("Erro ao validar token no backend:", data);
          throw new Error(data?.error || 'Falha na autenticação no servidor');
        }

        // Se o backend retornar dados do usuário, preferimos os dele
        if (data?.user) {
          const srvUser = {
            email: data.user.email || userData.email,
            nome: data.user.name || userData.nome,
            foto: data.user.picture || userData.foto,
          };
          setUsuario(srvUser);
          localStorage.setItem("usuario", JSON.stringify(srvUser));
        }

        if (data?.token) {
          localStorage.setItem("authToken", data.token);
        }
      } else {
        const text = await response.text();
        console.error("Resposta inesperada do backend:", text);
        throw new Error('Resposta inesperada do backend');
      }
      try {
        window.history.replaceState({}, '', '/selecionar-perfil');
      } catch (error) {
        console.error("Resposta inesperada:", error);
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
          </>
        )}
        <Routes>
          <Route
            path="/"
            element={
              logado ? (
                (() => {
                  const role = localStorage.getItem('selectedRole');
                  if (role === 'Administrador') return <Navigate to="/dashboard" />;
                  if (role === 'Aluno') return <Navigate to="/dashboard/aluno" />;
                  if (role === 'Professor') return <Navigate to="/dashboard/professor" />;
                  if (role === 'Coordenador') return <Navigate to="/dashboard/coordenador" />;
                  return <Navigate to="/selecionar-perfil" />;
                })()
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
          <Route path="/selecionar-perfil" element={<RotaProtegida><RoleSelection /></RotaProtegida>} />
          <Route path="/onboarding/:role" element={<RotaProtegida><CompletarCadastro /></RotaProtegida>} />
          <Route path="/nao-disponivel" element={<RotaProtegida><NotAvailable /></RotaProtegida>} />
          <Route path="/dashboard" element={<RotaProtegida><AdminDashboard /></RotaProtegida>} />
          <Route path="/dashboard/aluno" element={<RotaProtegida><DashboardAluno /></RotaProtegida>} />
          <Route path="/dashboard/professor" element={<RotaProtegida><DashboardProfessor /></RotaProtegida>} />
          <Route path="/dashboard/coordenador" element={<RotaProtegida><DashboardCoordenador /></RotaProtegida>} />
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
          <Route path="/registros" element={<RotaProtegida><ListarRegistro /></RotaProtegida>} />
          <Route path="/registros/cadastrar" element={<RotaProtegida><CadastrarRegistroAtendimento /></RotaProtegida>} />
          <Route path="/agenda" element={<RotaProtegida><Agenda /></RotaProtegida>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;