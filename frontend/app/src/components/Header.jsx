import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/ifrs-logo.svg";
import { useEffect, useState } from "react";

function Header({ usuario, onLogout, setUsuario, setLogado }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setUsuario(null);
    setLogado(false);
    onLogout(); // opcional, se quiser manter lógica externa
    navigate("/"); // redireciona para tela de login
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-success px-4 shadow position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <img src={logo} alt="IFRS Logo" style={{ height: "60px" }} />

          {usuario && (
            <nav className="d-flex gap-2 flex-wrap">
              <Link to="/" className="btn btn-light fw-semibold shadow-sm">Home</Link>
              <Link to="/disciplina" className="btn btn-light fw-semibold shadow-sm">Listar Disciplinas</Link>
              <Link to="/curso" className="btn btn-light fw-semibold shadow-sm">Listar Cursos</Link>
              <Link to="/turma" className="btn btn-light fw-semibold shadow-sm">Listar Turmas</Link>
              <Link to="/coord" className="btn btn-light fw-semibold shadow-sm">Listar Coordenadores</Link>
              <Link to="/alunos" className="btn btn-light fw-semibold shadow-sm">Listar Alunos</Link>
              <Link to="/professores" className="btn btn-light fw-semibold shadow-sm">Listar Professores</Link>
            </nav>
          )}
        </div>
      </div>

      {usuario && (
        <div
          className="position-absolute top-0 end-0 d-flex align-items-center gap-2 p-2"
          style={{ zIndex: 1000 }}
        >
          <img
            src={usuario.foto}
            alt="Foto de perfil"
            className="rounded-circle border border-white"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <span className="text-white fw-semibold">
            {usuario.nome?.split(" ")[0] || "Usuário"}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm fw-semibold"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;