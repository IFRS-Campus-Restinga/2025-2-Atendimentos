import { useEffect, useState } from 'react';
import { getApiUrl, getAuthHeaders } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminPermissions() {
  const [perms, setPerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [permFilter, setPermFilter] = useState('');
  const [selectedPerm, setSelectedPerm] = useState(null);
  const [selectedGroupForPerm, setSelectedGroupForPerm] = useState('');

  const authHeaders = getAuthHeaders();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [pRes, gRes] = await Promise.all([
          fetch(getApiUrl('/services/api/admin/permissions/'), { headers: { ...authHeaders } }),
          fetch(getApiUrl('/services/api/admin/groups/'), { headers: { ...authHeaders } }),
        ]);

        if (!pRes.ok) throw new Error('Falha ao carregar permissões');
        if (!gRes.ok) throw new Error('Falha ao carregar grupos');

        const pJson = await pRes.json();
        const gJson = await gRes.json();

        if (!mounted) return;
        setPerms(pJson || []);
        setGroups(gJson || []);
      } catch (e) {
        console.error(e);
        setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const addPermToGroup = async (groupId, permCodename) => {
    try {
      setError(null); setSuccess(null);
      const url = getApiUrl(`/services/api/admin/groups/${groupId}/perms/`);
      const res = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify({ perm_codename: permCodename })
      });
      if (!res.ok) throw new Error('Falha ao adicionar permissão');
      setSuccess('Permissão adicionada');
      // refresh groups
      const gRes = await fetch(getApiUrl('/services/api/admin/groups/'), { headers: { ...authHeaders } });
      setGroups(await gRes.json());
    } catch (e) { setError(String(e)); }
  };

  const removePermFromGroup = async (groupId, permCodename) => {
    try {
      setError(null); setSuccess(null);
      const url = getApiUrl(`/services/api/admin/groups/${groupId}/perms/${encodeURIComponent(permCodename)}/`);
      const res = await fetch(url, { method: 'DELETE', headers: { ...authHeaders } });
      if (!res.ok) throw new Error('Falha ao remover permissão');
      setSuccess('Permissão removida');
      const gRes = await fetch(getApiUrl('/services/api/admin/groups/'), { headers: { ...authHeaders } });
      setGroups(await gRes.json());
    } catch (e) { setError(String(e)); }
  };

  // Note: user-group assignment UI removed — only group <-> permissions management kept

  if (loading) return <main className="container py-5"><p>Carregando...</p></main>;

  return (
    <main className="container py-4" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-semibold">Admin — Permissões</h2>
        <div><Link to="/dashboard" className="btn btn-outline-secondary">Voltar</Link></div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-3 align-items-stretch">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title mb-0">Permissões disponíveis</h5>
                <div className="d-flex gap-2">
                  <select value={selectedGroupForPerm} onChange={(e) => setSelectedGroupForPerm(e.target.value)} className="form-select form-select-sm">
                    <option value="">Adicionar a grupo...</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <button className="btn btn-sm btn-primary" onClick={async () => {
                    setError(null); setSuccess(null);
                    if (!selectedPerm) return setError('Selecione uma permissão à esquerda');
                    if (!selectedGroupForPerm) return setError('Selecione um grupo para atribuir');
                    await addPermToGroup(selectedGroupForPerm, selectedPerm);
                  }}>Atribuir</button>
                </div>
              </div>

              <input className="form-control form-control-sm mb-2" placeholder="Filtrar permissões..." value={permFilter} onChange={(e) => setPermFilter(e.target.value)} />

              <div className="flex-grow-1 overflow-auto">
                <ul className="list-group">
                  {perms.filter(p => p.codename.toLowerCase().includes(permFilter.toLowerCase()) || (p.name || '').toLowerCase().includes(permFilter.toLowerCase())).map(p => (
                    <li key={p.id} className={`list-group-item d-flex justify-content-between align-items-center ${selectedPerm === p.codename ? 'active text-white' : ''}`} onClick={() => setSelectedPerm(p.codename)} style={{ cursor: 'pointer' }}>
                      <div>
                        <strong>{p.codename}</strong>
                        <div className="small text-muted">{p.name} — <small>{p.content_type__app_label}</small></div>
                      </div>
                      <div className="text-end small text-muted">{selectedPerm === p.codename ? 'Selecionada' : ''}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <small className="text-muted">Clique em uma permissão para selecioná-la e use "Atribuir".</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Grupos</h5>
              <div className="flex-grow-1 overflow-auto">
                {groups.map(g => (
                  <div key={g.id} className="mb-3 border-bottom pb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div><strong>{g.name}</strong></div>
                      <div><small className="text-muted">{g.permissions?.length || 0} perms</small></div>
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                      {g.permissions?.map(p => (
                        <span key={p.id} className="badge bg-secondary d-inline-flex align-items-center">
                          <span className="me-2">{p.codename}</span>
                          <button aria-label={`Remover ${p.codename} do ${g.name}`} className="btn btn-sm btn-outline-light p-0" style={{ lineHeight: 1 }} onClick={() => removePermFromGroup(g.id, p.codename)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 d-flex gap-2">
                      <select defaultValue="" className="form-select form-select-sm" onChange={(e) => { if(e.target.value) { addPermToGroup(g.id, e.target.value); e.target.value = ''; } }}>
                        <option value="">Adicionar permissão...</option>
                        {perms.filter(pp => !g.permissions.some(x => x.codename === pp.codename)).map(pp => (
                          <option key={pp.id} value={pp.codename}>{pp.codename}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
