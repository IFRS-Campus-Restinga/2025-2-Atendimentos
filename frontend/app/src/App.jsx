
// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import './index.css'
import Disciplinas from "./pages/Disciplina.jsx";

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