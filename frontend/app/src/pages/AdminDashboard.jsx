import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const cards = [
  { title: 'Cursos', listPath: '/curso', createPath: '/curso/cadastrar', description: 'Gerencie os cursos' },
  { title: 'Turmas', listPath: '/turma', createPath: '/turma/cadastrar', description: 'Gerencie as turmas' },
  { title: 'Coordenadores', listPath: '/coord', createPath: '/coord/cadastrar', description: 'Gerencie os coordenadores' },
  { title: 'Alunos', listPath: '/alunos', createPath: '/alunos/cadastrar', description: 'Gerencie os alunos' },
  { title: 'Professores', listPath: '/professores', createPath: '/professores/cadastrar', description: 'Gerencie os professores' },
  { title: 'Disciplinas', listPath: '/disciplina', createPath: '/disciplina/cadastrar', description: 'Gerencie as disciplinas' },
  { title: 'Agenda', listPath: '/agenda', description: 'Consulte a agenda' },
];

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (role !== 'Administrador') {
      navigate('/nao-disponivel');
    }
  }, [navigate]);

  return (
    <main className="container py-4">
      <h2 className="mb-4">Painel do Administrador</h2>
      <div className="row g-3">
        {cards.map((c) => (
          <div key={c.title} className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{c.title}</h5>
                <p className="card-text text-muted flex-grow-1">{c.description}</p>
                <div className="d-flex gap-2">
                  <Link to={c.listPath} className="btn btn-success">Listar</Link>
                  {c.createPath && (
                    <Link to={c.createPath} className="btn btn-outline-success">Cadastrar</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminDashboard;
