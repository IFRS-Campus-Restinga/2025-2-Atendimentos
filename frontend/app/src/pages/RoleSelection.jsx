import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';
import { checkProfileStatus } from '../services/api';

const ROLES = ['Aluno', 'Professor', 'Coordenador', 'Administrador'];

const DESCRICOES = {
  Aluno: 'Perfil de estudante do IFRS Campus Restinga. Acompanha disciplinas e solicita atendimentos quando necessário.',
  Professor: 'Perfil de docente. Gerencia turmas, acompanha registros de atendimento e agenda eventos acadêmicos.',
  Coordenador: 'Perfil de gestão de curso. Administra ofertas, coordena agendas e monitora registros de atendimento.',
  Administrador: 'Perfil do Ensino. Acesso administrativo às configurações e funcionalidades institucionais.',
};

function RoleSelection() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loadingRole, setLoadingRole] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
  }, []);

  const homeByRole = (role) => {
    if (role === 'Administrador') return '/dashboard';
    if (role === 'Aluno') return '/dashboard/aluno';
    if (role === 'Professor') return '/dashboard/professor';
    if (role === 'Coordenador') return '/dashboard/coordenador';
    return '/nao-disponivel';
  };

  const escolherPerfil = async (role) => {
    localStorage.setItem('selectedRole', role);
    setLoadingRole(role);
    try {
      const { exists } = await checkProfileStatus(role);
      if (exists) {
        navigate(homeByRole(role));
      } else {
        navigate(`/onboarding/${encodeURIComponent(role)}`);
      }
    } catch (e) {
      console.error(e);
      navigate('/nao-disponivel');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-column align-items-center gap-4">
        <h2 className="text-success fw-semibold">Selecione seu perfil</h2>
        {usuario && (
          <p className="text-muted m-0">Olá, {usuario.nome?.split(' ')[0] || 'usuário'}! Escolha como deseja continuar.</p>
        )}

        <div className="row g-3 w-100" style={{ maxWidth: 720 }}>
          {ROLES.map((role) => (
            <div className="col-12 col-sm-6" key={role}>
              <button
                className="role-card btn btn-outline-success w-100 p-4 text-start"
                onClick={() => escolherPerfil(role)}
                aria-describedby={`desc-${role}`}
                disabled={loadingRole === role}
                aria-busy={loadingRole === role}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span className="fw-semibold fs-5">{role}</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">Selecionar</span>
                </div>
                <div id={`desc-${role}`} className="role-desc mt-2 text-muted small">
                  {DESCRICOES[role]}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default RoleSelection;
