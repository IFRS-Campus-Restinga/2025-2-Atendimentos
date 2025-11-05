import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ifrs_logo_branca.png";
import { useEffect, useState } from "react";
import "./Header.css";

function Header({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const carregarUsuario = () => {
      const usuarioSalvo = localStorage.getItem("usuario");
      setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
      setRole(localStorage.getItem("selectedRole"));
    };

    carregarUsuario();
    window.addEventListener("storage", carregarUsuario);

    return () => {
      window.removeEventListener("storage", carregarUsuario);
    };
  }, [location]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("selectedRole");
    }
    setUsuario(null);
    setRole(null);
    navigate("/");
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="navbar navbar-dark bg-success px-3 shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-4">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={goBack}
            aria-label="Voltar para página anterior"
            title="Voltar"
          >
            Voltar
          </button>
          <div className="header__title">
            <Link
              to={role === "Administrador" ? "/dashboard" : "/"}
              className="title-link d-flex align-items-center text-decoration-none"
              aria-label="Ir para a página inicial"
              title="Início"
            >
              <img src={logo} alt="IFRS" className="title-img me-2" />
              <h1 className="title-campus m-0 text-white">
                <small className="d-block fw-normal">
                  Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul
                </small>
                <span className="fw-semibold">Campus Restinga</span>
              </h1>
            </Link>
          </div>
        </div>

        {usuario && (
          <div className="d-flex align-items-center gap-2">
            <img
              src={usuario.foto}
              alt="Foto de perfil"
              className="rounded-circle border border-white"
              style={{ width: "36px", height: "36px", objectFit: "cover" }}
            />
            <span className="text-white fw-semibold">
              {`Olá, ${role || "Usuário"} ${usuario.nome?.split(" ")[0] || ""}`}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm fw-semibold"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;