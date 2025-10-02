// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import './index.css'
import Disciplinas from "./pages/Disciplina.jsx";
import CadastrarCurso from './pages/Curso/CadastrarCurso.jsx';
import ListarCurso from './pages/Curso/ListarCurso.jsx';
import CadastrarTurma from './pages/Turma/CadastrarTurma.jsx';
import ListarTurma from './pages/Turma/ListarTurma.jsx';
import CadastraCoordenador from './pages/Coordenador/CadastraCoordenador.jsx'
import ListarCoordenador from './pages/Coordenador/ListarCoordenador.jsx';
import ListarAluno from './pages/Aluno/ListarAluno.jsx';
import CadastraAluno from './pages/Aluno/CadastraAluno';
import ListarProfessor from './pages/Professor/ListarProfessor.jsx';
import CadastraProfessor from './pages/Professor/CadastraProfessor';
 

function App() {
  //const [usuario, setUsuario] = useState(null);
  //const [logado, setLogado] = useState(false);
  //useEffect(() => {
  //  const usuarioSalvo = localStorage.getItem("usuario");
  //  if (usuarioSalvo) {
  //    setUsuario(JSON.parse(usuarioSalvo));
  //    setLogado(true);
  //  }
  //}, []);

  return (
    <Router>
        <div>
          <Header />
          <hr />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/appointments" element={<h1>Página de Atendimentos</h1>} />
              <Route path="/disciplina" element={<Disciplinas />} />
        
              <Route path="/curso" element={<ListarCurso />} key="listar-cursos"/>
              <Route path="/curso/cadastrar" element={<CadastrarCurso />}key="cadastrar-cursos" />

              <Route path="/turma" element={<ListarTurma />} key="listar-turmas"/>
              <Route path="/turma/cadastrar" element={<CadastrarTurma />}key="cadastrar-turmas" />

              <Route path="/coord" element={<ListarCoordenador />} key="listar-coordenador"/>
              <Route path="/coord/cadastrar" element={<CadastraCoordenador />} key="cadastrar-coordenador" />

              <Route path="/alunos" element={<ListarAluno />} key="listar-alunos"/>
              <Route path="/alunos/cadastrar" element={<CadastraAluno />} />  

              <Route path="/professores" element={<ListarProfessor />} />
              <Route path="/professores/cadastrar" element={<CadastraProfessor />} />          
            </Routes>
        </div>
    </Router>
  );
  
}

export default App;




//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Header from "./components/Header";
//import Login from "./pages/Login";
//import './index.css'
//
//
//function App() {
//  return (
//    <Router>
//      <Header />
//      <Routes>
//        <Route path="/" element={<Login />} />
//        <Route path="/appointments" element={<h1>Página de Atendimentos</h1>} />
//      </Routes>
//    </Router>
//  );
//}
//
//export default App;