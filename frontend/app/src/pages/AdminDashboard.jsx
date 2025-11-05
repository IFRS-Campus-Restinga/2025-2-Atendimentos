import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (role !== 'Administrador') {
      navigate('/nao-disponivel');
    }
  }, [navigate]);

  return (
    <main className="container py-4 dashboard" style={{ maxWidth: 1140 }}>
      <h2 className="mb-1">Painel do Administrador</h2>
      <p className="text-muted mb-4 small">Acesse rapidamente pessoas, estrutura acadêmica, agenda e registros.</p>

      <div className="row g-3">
        {/* Coluna 1: Pessoas */}
        <div className="col-12 col-lg-4">
          <h5 className="mb-2 dashboard-section-title">Pessoas</h5>

          <Link to="/alunos" className="text-decoration-none">
            <div className="app-card is-alunos position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">ALU</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Alunos</h6>
                  <p className="text-muted small mb-2">Veja a lista, edite dados básicos e cadastre novos alunos.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/professores" className="text-decoration-none">
            <div className="app-card is-prof position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">PROF</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Professores</h6>
                  <p className="text-muted small mb-2">Acompanhe a lista, ajuste informações e inclua novos professores.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/coord" className="text-decoration-none">
            <div className="app-card is-coord position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">COORD</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Coordenadores</h6>
                  <p className="text-muted small mb-2">Gerencie a equipe de coordenação e suas permissões de acesso.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Coluna 2: Acadêmico */}
        <div className="col-12 col-lg-4">
          <h5 className="mb-2 dashboard-section-title">Acadêmico</h5>

          <Link to="/curso" className="text-decoration-none">
            <div className="app-card is-curso position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">CUR</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Cursos</h6>
                  <p className="text-muted small mb-2">Crie e atualize cursos; defina código, tipo e coordenação.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/turma" className="text-decoration-none">
            <div className="app-card is-turma position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">TUR</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Turmas</h6>
                  <p className="text-muted small mb-2">Crie turmas e ajuste semestre/ano, turno e curso.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/disciplina" className="text-decoration-none">
            <div className="app-card is-disc position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">DISC</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Disciplinas</h6>
                  <p className="text-muted small mb-2">Cadastre disciplinas e controle status e código de oferta.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Coluna 3: Agenda e Registros */}
        <div className="col-12 col-lg-4">
          <h5 className="mb-2 dashboard-section-title">Agenda e Registros</h5>

          <Link to="/agenda" className="text-decoration-none">
            <div className="app-card is-agenda position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">AG</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Agenda</h6>
                  <p className="text-muted small mb-2">Consulte eventos da semana e acesse detalhes e horários.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/registros" className="text-decoration-none">
            <div className="app-card is-reg position-relative mb-3">
              <div className="app-card-body">
                <div className="app-card-icon">RG</div>
                <div className="app-card-content">
                  <h6 className="mb-1">Registros</h6>
                  <p className="text-muted small mb-2">Registre atendimentos e consulte o histórico por data e turma.</p>
                  <div className="app-card-actions">
                    <span className="app-card-hover-label">Acessar</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
