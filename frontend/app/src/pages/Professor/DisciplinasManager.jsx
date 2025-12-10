import { useEffect, useMemo, useState } from 'react';
import { getMyProfile, saveUsuarioMe, API_CONFIG, getAuthHeaders } from '../../services/api';
import { Link } from 'react-router-dom';

export default function DisciplinasManager() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const perfil = await getMyProfile('Professor');
        // disciplinas no perfil são array de ids
        const myIds = perfil?.disciplinas || [];
        setSelected(myIds.map(id => Number(id)));

        const res = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.disciplinas}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', ...getAuthHeaders() },
          credentials: 'include',
        });
        const data = await res.json();
        const list = data?.results || data || [];
        if (mounted) setDisciplinas(list.map(d => ({ ...d })));
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return disciplinas;
    return disciplinas.filter(d => (`${d.codigo} ${d.nome}`).toLowerCase().includes(q));
  }, [disciplinas, query]);

  const toggle = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = { disciplinas: selected };
      await saveUsuarioMe(payload);
      setSuccess('Disciplinas salvas com sucesso.');
    } catch (e) {
      setError('Falha ao salvar: ' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="container py-5"><p>Carregando...</p></main>;
  if (error) return <main className="container py-5"><p className="text-danger">{error}</p></main>;

  return (
    <main className="container py-4" style={{ maxWidth: 960 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-semibold">Minhas Disciplinas</h2>
        <div>
          <Link to="/dashboard/professor" className="btn btn-outline-secondary">Voltar</Link>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-3">
            <input className="form-control" placeholder="Buscar por código ou nome" value={query} onChange={e => setQuery(e.target.value)} />
          </div>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          {/* Selected as badges */}
          {selected.length > 0 && (
            <div className="mb-3">
              <div className="small text-muted mb-1">Selecionadas:</div>
              <div className="d-flex flex-wrap gap-2">
                {selected.map(id => {
                  const d = disciplinas.find(x => x.id === id);
                  if (!d) return null;
                  return (
                    <span key={id} className="badge bg-primary text-white">{d.codigo}</span>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {filtered.length === 0 && <p className="text-muted">Nenhuma disciplina encontrada.</p>}
            <div className="list-group">
              {filtered.map(d => (
                <label key={d.id} className="list-group-item d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-2" checked={selected.includes(d.id)} onChange={() => toggle(d.id)} />
                  <div>
                    <div><strong>{d.codigo}</strong> — {d.nome}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={() => { setSelected([]); }}>Limpar</button>
            <button className="btn btn-success" onClick={onSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
