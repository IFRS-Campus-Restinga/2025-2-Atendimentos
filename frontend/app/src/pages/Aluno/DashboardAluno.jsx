import { useEffect, useState } from 'react';
import { getMyProfile } from '../../services/api';
import './Aluno.css';
import { Link } from 'react-router-dom';

export default function DashboardAluno() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMyProfile('Aluno');
        if (mounted) setData(res);
      } catch (e) {
        setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <main className="container py-5"><p>Carregando...</p></main>;
  if (error) return <main className="container py-5"><p className="text-danger">{error}</p></main>;

  return (
    <main className="container py-5" style={{ maxWidth: 960 }}>
      <h2 className="text-success fw-semibold mb-4">Dashboard — Aluno</h2>

      {data && (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seus dados</h5>
                <ul className="mb-0">
                  <li><strong>Nome:</strong> {data.nome}</li>
                  <li><strong>Matrícula:</strong> {data.matricula || '-'}</li>
                  <li><strong>Curso:</strong> {data.curso}</li>
                  <li><strong>Aluno PEI:</strong> {data.alunoPEI ? 'Sim' : 'Não'}</li>
                  <li><strong>Email:</strong> {data.email}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">Agenda</h5>
                  <p className="text-muted">Visualize a agenda semanal de eventos.</p>
                </div>
                <div>
                  <Link to="/agenda" className="btn btn-success">Abrir Agenda</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card de convocações recebidas */}
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">Convocações</h5>
                  <p className="text-muted">Veja suas convocações de atendimento.</p>
                </div>
                <div>
                  <Link to="/convocacoes" className="btn btn-outline-success">Ver Convocações</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">Eventos Extraordinários</h5>
                  <p className="text-muted">Solicite ou acompanhe atendimentos extraordinários.</p>
                </div>
                <div>
                  <Link to="/eventos-extra" className="btn btn-outline-primary">Abrir Eventos</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
