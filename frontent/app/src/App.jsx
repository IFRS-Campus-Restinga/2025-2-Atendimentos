import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import './index.css'


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/appointments" element={<h1>Página de Atendimentos</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
