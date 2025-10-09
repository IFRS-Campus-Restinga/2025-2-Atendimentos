import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ifrs-logo.svg';

const ROLES = ['Aluno', 'Professor', 'Coordenador', 'Administrador'];

function RoleSelection() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
  }, []);

  const escolherPerfil = (role) => {
    localStorage.setItem('selectedRole', role);
    if (role === 'Administrador') {
      navigate('/dashboard');
    } else {
      navigate('/nao-disponivel');
    }
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-column align-items-center gap-4">
        <img src={logo} alt="IFRS Logo" style={{ height: '90px' }} />
        <h2 className="text-success fw-semibold">Selecione seu perfil</h2>
        {usuario && (
          <p className="text-muted m-0">Olá, {usuario.nome?.split(' ')[0] || 'usuário'}! Escolha como deseja continuar.</p>
        )}

        <div className="row g-3 w-100" style={{ maxWidth: 720 }}>
          {ROLES.map((role) => (
            <div className="col-12 col-sm-6" key={role}>
              <button
                className="btn btn-outline-success w-100 p-4 text-start d-flex align-items-center justify-content-between"
                onClick={() => escolherPerfil(role)}
              >
                <span className="fw-semibold fs-5">{role}</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">Selecionar</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default RoleSelection;
