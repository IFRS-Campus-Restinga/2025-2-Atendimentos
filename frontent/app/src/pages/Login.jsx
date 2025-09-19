import logo from "../assets/ifrs-logo.svg";
import ButtonGoogle from "../components/ButtonGoogle";

function Login() {
  return (
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <h1 className="fw-semibold mb-5">Sistema de Atendimentos</h1>

      <div className="card shadow-lg p-4 d-flex flex-md-row align-items-center gap-4" style={{ borderRadius: "12px" }}>
        <img src={logo} alt="IFRS Logo" className="img-fluid" style={{ height: "110px" }} />

        <div className="text-center">
          <h2 className="text-success mb-4">Acesse sua Conta</h2>
          <ButtonGoogle />
        </div>
      </div>
    </main>
  );
}

export default Login;
