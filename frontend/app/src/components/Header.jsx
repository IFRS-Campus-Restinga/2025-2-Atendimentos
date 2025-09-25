import { Link } from "react-router-dom";
import logo from "../assets/ifrs-logo.svg";
import Disciplinas from "../pages/Disciplina";

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-success px-4 shadow">
      <div className="container-fluid">
        <img src={logo} alt="IFRS Logo" className="me-3" style={{ height: "60px" }} />

        <nav className="d-flex gap-3">
          <Link to="/" className="btn btn-light fw-semibold shadow-sm">
            Home
          </Link>
          <Link to="/disciplina" className="btn btn-light fw-semibold shadow-sm">
            DISCIPLINAS
          </Link>
          <Link to="/curso/cadastrar" className="btn btn-light fw-semibold shadow-sm">
            cadastrar Cursos
          </Link>
          <Link to="/curso" className="btn btn-light fw-semibold shadow-sm">
            Listar Cursos
          </Link>

        </nav>
      </div>
    </header>
  );
}

export default Header;
