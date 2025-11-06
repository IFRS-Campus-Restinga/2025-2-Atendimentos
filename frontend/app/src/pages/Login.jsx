import { useState, useEffect } from "react";
import logo from "../assets/ifrs-logo.svg";
import ButtonGoogle from "../components/ButtonGoogle";

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      const usuarioObj = JSON.parse(usuarioSalvo);
      setUsuario(usuarioObj);
    }
  }, []);

  return (
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <h1 className="fw-semibold mb-5">Sistema de Atendimentos</h1>

      <div
        className="card shadow-lg p-4 d-flex flex-column align-items-center gap-4"
        style={{ borderRadius: "12px", maxWidth: "500px" }}
      >
        <img src={logo} alt="IFRS Logo" className="img-fluid" style={{ height: "110px" }} />

        <h2 className="text-success mb-4">Acesse sua Conta</h2>
        <ButtonGoogle onLoginSuccess={onLoginSuccess} />

        {usuario && (
          <div className="mt-4 text-center">
            <img
              src={usuario.foto}
              alt="Foto de perfil"
              className="rounded-circle border"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <h5 className="mt-2 fw-semibold">Olá, {usuario.nome}!</h5>
          </div>
        )}
      </div>
    </main>
  );
}

export default Login;