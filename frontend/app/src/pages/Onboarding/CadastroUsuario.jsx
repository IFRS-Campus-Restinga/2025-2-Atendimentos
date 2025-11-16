import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUsuarioMe, API_CONFIG, getAuthHeaders } from '../../services/api';

const ROLE_OPTIONS = [
  { label: 'Aluno', value: 'ALU' },
  { label: 'Professor', value: 'PROF' },
  { label: 'Coordenador', value: 'COORD' },
  { label: 'Administrador', value: 'ADM' },
];

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    tipoPerfil: '',
    // Campos específicos por papel
    registro: '',
    matricula: '',
    curso_id: ''
  });
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCoordRedirecting, setIsCoordRedirecting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        // Buscar dados do usuário
        const userRes = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarioMe}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', ...getAuthHeaders() },
          credentials: 'include',
        });
        const userData = await userRes.json();
        
        // Verificar se é coordenador pelo email institucional
        const email = userData?.email || '';
        // Emails coord. teste - temporário para desenvolvimento
        const isCoordEmail = /@gmail\.com$/i.test(email);
        
        console.log('DEBUG - Email do usuário:', email);
        console.log('DEBUG - É email de coordenador:', isCoordEmail);
        console.log('DEBUG - Perfil atual:', userData?.tipoPerfil);
        
        if (!ignore && isCoordEmail) {
          // Se é email de coordenador, redirecionar automaticamente
          console.log('DEBUG - Redirecionando coordenador automaticamente');
          setIsCoordRedirecting(true);
          try {
            // Se ainda não tem perfil ou não é COORD, salvar como coordenador
            if (!userData?.tipoPerfil || userData.tipoPerfil !== 'COORD') {
              const payload = {
                nome: userData?.nome || '',
                email: email,
                tipoPerfil: 'COORD',
              };
              await saveUsuarioMe(payload);
            }
            
            localStorage.setItem('selectedRole', 'Coordenador');
            navigate('/dashboard/coordenador');
            return;
          } catch (err) {
            console.error('Erro ao salvar coordenador automaticamente:', err);
            setIsCoordRedirecting(false);
          }
        }
        
        // Buscar cursos disponíveis
        const cursosRes = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.cursos}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', ...getAuthHeaders() },
          credentials: 'include',
        });
        const cursosData = await cursosRes.json();
        
        if (!ignore) {
          setForm({
            nome: userData?.nome || '',
            email: userData?.email || '',
            tipoPerfil: userData?.tipoPerfil || '',
            registro: userData?.registro || '',
            matricula: userData?.matricula || '',
            curso_id: userData?.curso?.id || '',
          });
          setCursos(cursosData?.results || cursosData || []);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [navigate]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSave = useMemo(() => {
    const basic = form.nome && form.email && form.tipoPerfil && isValidEmail(form.email);
    
    if (form.tipoPerfil === 'PROF') {
      return basic && form.registro;
    }
    if (form.tipoPerfil === 'ALU') {
      return basic && form.matricula && form.curso_id;
    }
    if (form.tipoPerfil === 'COORD') {
      // Emails coord. teste - temporário para desenvolvimento
      const pattern = /@gmail\.com$/i;
      return basic && pattern.test(form.email);
    }
    // ADM só precisa dos campos básicos
    return basic;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        tipoPerfil: form.tipoPerfil,
      };
      
      // Adicionar campos específicos conforme o papel
      if (form.tipoPerfil === 'PROF') {
        payload.registro = form.registro;
      } else if (form.tipoPerfil === 'ALU') {
        payload.matricula = form.matricula;
        payload.curso_id = form.curso_id;
      }
      
      await saveUsuarioMe(payload);
      
      // Salvar selectedRole e redirecionar para dashboard apropriado
      const roleMap = { 'ALU': 'Aluno', 'PROF': 'Professor', 'COORD': 'Coordenador', 'ADM': 'Administrador' };
      const roleName = roleMap[form.tipoPerfil];
      localStorage.setItem('selectedRole', roleName);
      
      // Redirecionar conforme o papel
      if (form.tipoPerfil === 'ADM') {
        navigate('/dashboard');
      } else if (form.tipoPerfil === 'ALU') {
        navigate('/dashboard/aluno');
      } else if (form.tipoPerfil === 'PROF') {
        navigate('/dashboard/professor');
      } else if (form.tipoPerfil === 'COORD') {
        navigate('/dashboard/coordenador');
      }
    } catch (err) {
      alert(err?.message || 'Falha ao salvar cadastro do usuário');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="container py-5"><p>Carregando...</p></main>;
  
  if (isCoordRedirecting) {
    return (
      <main className="container py-5" style={{ maxWidth: 720 }}>
        <div className="text-center">
          <h2 className="text-success fw-semibold mb-3">Coordenador Identificado</h2>
          <p className="text-muted mb-3">Seu email institucional foi validado automaticamente.</p>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Redirecionando...</span>
          </div>
          <p className="mt-2">Redirecionando para o dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="text-success fw-semibold mb-2">Cadastro do Usuário</h2>
      <p className="text-muted">Confirme seus dados básicos para criar seu usuário no sistema.</p>

      <form className="border rounded p-4 bg-white" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Tipo de Usuário <span className="text-danger">*</span></label>
          <select className="form-select" name="tipoPerfil" value={form.tipoPerfil} onChange={onChange} required>
            <option value="" disabled>Selecione seu perfil...</option>
            {ROLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {form.tipoPerfil && (
          <>
            <div className="mb-3">
              <label className="form-label">Nome <span className="text-danger">*</span></label>
              <input className="form-control" name="nome" value={form.nome} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email <span className="text-danger">*</span></label>
              <input 
                type="email" 
                className={`form-control ${form.tipoPerfil === 'COORD' && form.email && !/@gmail\.com$/i.test(form.email) ? 'is-invalid' : ''}`}
                name="email" 
                value={form.email} 
                onChange={onChange} 
                required 
              />
              {form.tipoPerfil === 'COORD' && (
                <div className="form-text">
                  Para testes: use qualquer email @gmail.com (temporário)
                </div>
              )}
            </div>

            {form.tipoPerfil === 'PROF' && (
              <div className="mb-3">
                <label className="form-label">Registro <span className="text-danger">*</span></label>
                <input className="form-control" name="registro" value={form.registro} onChange={onChange} required />
              </div>
            )}

            {form.tipoPerfil === 'ALU' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Matrícula <span className="text-danger">*</span></label>
                  <input className="form-control" name="matricula" value={form.matricula} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Curso <span className="text-danger">*</span></label>
                  <select className="form-select" name="curso_id" value={form.curso_id} onChange={onChange} required>
                    <option value="" disabled>Selecione seu curso...</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nome} ({curso.codigo})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={!canSave || saving}>
            {saving ? 'Salvando...' : 'Salvar e continuar'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)} disabled={saving}>
            Voltar
          </button>
        </div>
      </form>
    </main>
  );
}
