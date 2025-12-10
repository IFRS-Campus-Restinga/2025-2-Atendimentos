import { useEffect, useState } from 'react';
import { getMyProfile, API_CONFIG, getAuthHeaders } from '../../services/api';
import './Professor.css';
import { Link } from 'react-router-dom';

// Mostra disciplinas do professor como badges mais limpas

export default function DashboardProfessor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMyProfile('Professor');
        if (!mounted) return;
        setData(res);

        // Buscar detalhes das disciplinas e mapear as do professor
        const disciplinaIds = res?.disciplinas || [];
        if (disciplinaIds.length) {
          const dRes = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.disciplinas}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', ...getAuthHeaders() },
            credentials: 'include',
          });
          const dData = await dRes.json();
          const all = dData?.results || dData || [];
          const profList = all.filter(d => disciplinaIds.includes(d.id));
          if (mounted) setData(prev => ({ ...prev, disciplinas_full: profList }));
        } else {
          if (mounted) setData(prev => ({ ...prev, disciplinas_full: [] }));
        }
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
      <h2 className="text-success fw-semibold mb-4">Dashboard — Professor</h2>

      {data && (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seus dados</h5>
                <ul className="mb-0">
                  <li><strong>Registro:</strong> {data.registro}</li>
                  <li className="prof-disciplinas">
                    <strong>Disciplinas:</strong>
                    {data.disciplinas_full && data.disciplinas_full.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {data.disciplinas_full.map(d => (
                          <span key={d.id} className="badge bg-success text-white me-1 mb-1" title={d.nome}>
                            {d.codigo}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted ms-2">Nenhuma disciplina atribuída. <Link to="/dashboard/professor/disciplinas">Gerenciar</Link></span>
                    )}
                  </li>
                </ul>
                <div className="mt-3 d-flex justify-content-end">
                  <Link to="/dashboard/professor/disciplinas" className="btn btn-sm btn-success">Gerenciar Disciplinas</Link>
                </div>
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
                <div className="d-flex gap-2">
                  <Link to="/agenda" className="btn btn-success">Abrir Agenda</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
