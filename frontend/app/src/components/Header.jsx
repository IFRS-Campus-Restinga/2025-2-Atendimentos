import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ifrs-logo.svg";
import { useEffect, useState } from "react";

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
  }, []);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
    setRole(localStorage.getItem("selectedRole"));
  }, [location]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // fallback
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
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-light btn-sm" onClick={goBack} aria-label="Voltar">
            ←
          </button>
          <img src={logo} alt="IFRS Logo" style={{ height: "48px" }} />
          {role === 'Administrador' && (
            <Link to={"/dashboard"} className="btn btn-light btn-sm">Home</Link>
          )}
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
              {role && role === 'Administrador' &&(
                "Olá, " + role + " " + usuario.nome?.split(" ")[0] || "Usuário"
              )}
            </span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm fw-semibold">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;