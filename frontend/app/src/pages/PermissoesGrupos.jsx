import { useEffect, useState } from "react";
import { getApiUrl, getAuthHeaders } from "../services/api";

const PERMISSOES = [
  { codename: "pode_aprovar_evento", label: "Aprovar/Confirmar Evento" },
  { codename: "pode_cancelar_evento", label: "Cancelar Evento" },
  { codename: "pode_reagendar_evento", label: "Reagendar Evento" },
  { codename: "pode_aprovar_como_professor", label: "Aprovar como Professor" },
];

const GRUPOS = ["Alunos", "Professores", "Coordenadores", "Administradores"];

function PermissoesGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        fetch(getApiUrl("permissoesGrupos"))
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(setGrupos)
        .catch((err) => {
          console.error("Erro ao carregar permissões:", err);
          setError(err);
        })
        .finally(() => setLoading(false));
    }, []);

  const handlePermChange = (grupo, perm, checked) => {
    const perms = grupos.find(g => g.grupo === grupo)?.permissoes || [];
    const newPerms = checked
      ? [...perms, perm]
      : perms.filter(p => p !== perm);
    setLoading(true);
      fetch(getApiUrl("permissoesGrupos"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ grupo, permissoes: newPerms }),
    })
      .then(() => {
        setGrupos(grupos.map(g => g.grupo === grupo ? { ...g, permissoes: newPerms } : g));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  if (loading) return <div>Carregando permissões...</div>;
  if (error && (!grupos || grupos.length === 0)) return <div>Erro ao carregar permissões.</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Permissões dos Grupos</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Grupo</th>
            {PERMISSOES.map(p => <th key={p.codename}>{p.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {grupos.map(grupo => (
            <tr key={grupo.grupo}>
              <td>{grupo.grupo}</td>
              {PERMISSOES.map(perm => (
                <td key={perm.codename}>
                  <input
                    type="checkbox"
                    checked={grupo.permissoes.includes(perm.codename)}
                    onChange={e => handlePermChange(grupo.grupo, perm.codename, e.target.checked)}
                    disabled={loading}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PermissoesGrupos;
