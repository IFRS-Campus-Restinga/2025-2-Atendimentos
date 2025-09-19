import { Link } from "react-router-dom";
import logo from "../assets/ifrs-logo.svg";

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-success px-4 shadow">
      <div className="container-fluid">
        <img src={logo} alt="IFRS Logo" className="me-3" style={{ height: "48px" }} />

        <nav className="d-flex gap-3">
          <Link to="/" className="btn btn-light fw-semibold shadow-sm">
            Home
          </Link>
          <Link to="/appointments" className="btn btn-light fw-semibold shadow-sm">
            Gerenciar Atendimentos
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
