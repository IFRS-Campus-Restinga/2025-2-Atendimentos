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
import CadastroUsuario from './pages/Onboarding/CadastroUsuario.jsx';
import DashboardAluno from './pages/Aluno/DashboardAluno.jsx';
import DashboardProfessor from './pages/Professor/DashboardProfessor.jsx';
import DisciplinasManager from './pages/Professor/DisciplinasManager.jsx';
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
import ListaAtendimentosEscolares from './pages/AtendimentoEscolar/ListaAtendimentosEscolares.jsx';
import CadastrarAtendimentoEscolar from './pages/AtendimentoEscolar/CadastrarAtendimentoEscolar.jsx';

function App() {
  // Inicializa estado de autenticação de forma síncrona para evitar redirecionar ao recarregar rotas protegidas (ex.: /agenda)
  const [usuario, setUsuario] = useState(() => {
    try {
      const u = localStorage.getItem("usuario");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [logado, setLogado] = useState(() => {
    const u = localStorage.getItem("usuario");
    const t = localStorage.getItem("authToken");
    return Boolean(u && t);
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    const tokenSalvo = localStorage.getItem("authToken");
    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setLogado(true);
    } else {
      setUsuario(null);
      setLogado(false);
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

      // Não marcar como logado agora nem navegar — primeiro validar no backend
      // Nem salvar o usuário no localStorage antes de receber o token.
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
        let finalUser = userData;
        if (data?.user) {
          finalUser = {
            email: data.user.email || userData.email,
            nome: data.user.name || userData.nome,
            foto: data.user.picture || userData.foto,
          };
        }

        if (data?.token) {
          // Salva token 
          localStorage.setItem("authToken", data.token);

          // Buscar perfil completo usando o token 
          const perfilRes = await fetch(getApiUrl('usuarioMe'), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${data.token}`
            }
          });

          if (!perfilRes.ok) {
            console.error('Falha ao obter perfil após login:', await perfilRes.text());
            throw new Error('Falha ao obter perfil do usuário');
          }

          const perfil = await perfilRes.json();

          // Preferir dados vindos do perfil completo
          const userFromProfile = perfil || {};
          const mergedUser = {
            email: userFromProfile.email || finalUser.email,
            nome: userFromProfile.nome || finalUser.nome,
            foto: finalUser.foto,
          };

          setUsuario(mergedUser);
          localStorage.setItem("usuario", JSON.stringify(mergedUser));
          setLogado(true);

          // Decide o dash com base no perfil
          try {
            const needsComplemento = userFromProfile.needs_complemento ?? true;
            if (needsComplemento) {
              window.history.replaceState({}, '', '/onboarding/usuario');
            } else {
              const tipo = userFromProfile.tipoPerfil || null;
              const mapRole = {
                'PROF': 'Professor',
                'ALU': 'Aluno',
                'COORD': 'Coordenador',
                'ADM': 'Administrador'
              };
              const roleName = mapRole[tipo] || null;
              if (roleName) localStorage.setItem('selectedRole', roleName);

              let dest = '/onboarding/usuario';
              if (roleName === 'Administrador') dest = '/dashboard';
              else if (roleName === 'Aluno') dest = '/dashboard/aluno';
              else if (roleName === 'Professor') dest = '/dashboard/professor';
              else if (roleName === 'Coordenador') dest = '/dashboard/coordenador';

              window.history.replaceState({}, '', dest);
            }
          } catch (error) {
            console.error("Erro ao decidir rota:", error);
            window.history.replaceState({}, '', '/onboarding/usuario');
          }

        } else {
          console.error('Backend não retornou token.');
          throw new Error('Falha na autenticação no servidor');
        }
      } else {
        const text = await response.text();
        console.error("Resposta inesperada do backend:", text);
        throw new Error('Resposta inesperada do backend');
      }
      try {
        const needsComplemento = data?.user?.needs_complemento ?? true;
        if (needsComplemento) {
          window.history.replaceState({}, '', '/onboarding/usuario');
        } else {
       
          const tipo = data?.user?.tipoPerfil || null; // ex: 'PROF', 'ALU', 'COORD', 'ADM'
          const mapRole = {
            'PROF': 'Professor',
            'ALU': 'Aluno',
            'COORD': 'Coordenador',
            'ADM': 'Administrador'
          };
          const roleName = mapRole[tipo] || null;
          if (roleName) localStorage.setItem('selectedRole', roleName);

        
          let dest = '/onboarding/usuario';
          if (roleName === 'Administrador') dest = '/dashboard';
          else if (roleName === 'Aluno') dest = '/dashboard/aluno';
          else if (roleName === 'Professor') dest = '/dashboard/professor';
          else if (roleName === 'Coordenador') dest = '/dashboard/coordenador';

          window.history.replaceState({}, '', dest);
        }
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
                  // Sem role selecionada ainda: primeiro completa o cadastro do Usuario
                  return <Navigate to="/onboarding/usuario" />;
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
          <Route path="/onboarding/usuario" element={<RotaProtegida><CadastroUsuario /></RotaProtegida>} />
          <Route path="/onboarding/:role" element={<RotaProtegida><CompletarCadastro /></RotaProtegida>} />
          <Route path="/nao-disponivel" element={<RotaProtegida><NotAvailable /></RotaProtegida>} />
          <Route path="/dashboard" element={<RotaProtegida><AdminDashboard /></RotaProtegida>} />
          <Route path="/dashboard/aluno" element={<RotaProtegida><DashboardAluno /></RotaProtegida>} />
          <Route path="/dashboard/professor" element={<RotaProtegida><DashboardProfessor /></RotaProtegida>} />
          <Route path="/dashboard/professor/disciplinas" element={<RotaProtegida><DisciplinasManager /></RotaProtegida>} />
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
          <Route path="/atendimentos" element={<RotaProtegida><ListaAtendimentosEscolares /></RotaProtegida>} />
          <Route path="/atendimentos/cadastrar" element={<RotaProtegida><CadastrarAtendimentoEscolar /></RotaProtegida>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;