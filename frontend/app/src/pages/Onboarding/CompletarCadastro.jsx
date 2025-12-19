import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postComplementoCadastro } from '../../services/api';

const ROLE_TO_CODE = {
  Aluno: 'ALU',
  Professor: 'PROF',
  Coordenador: 'COORD',
  Administrador: 'ADM',
};

export default function CompletarCadastro() {
  const navigate = useNavigate();
  const { role } = useParams();
  const roleCode = ROLE_TO_CODE[role] || null;

  const isAluno = role === 'Aluno';
  const isProfessor = role === 'Professor';
  const isCoordenador = role === 'Coordenador';

  const [form, setForm] = useState({
    cpf: '',
    telefone: '',
    // Aluno
    matricula: '',
    curso: '',
    turma: '',
    alunoPEI: false,
    // Professor
    registro: '',
    disciplina: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Validação local do e-mail institucional para Coordenador, mesma regra do backend
  const emailUsuario = useMemo(() => {
    try {
      const raw = localStorage.getItem('usuario');
      const u = raw ? JSON.parse(raw) : null;
      return (u?.email || '').trim();
    } catch {
      return '';
    }
  }, []);

  const emailOk = useMemo(() => {
    if (!isCoordenador) return true; // só valida para coordenador
    const pattern = /^\d+@([a-z0-9-]+\.)*restinga\.ifrs\.edu\.br$/i;
    return pattern.test(emailUsuario);
  }, [emailUsuario, isCoordenador]);

  const canSubmit = useMemo(() => {
    if (isAluno) return form.matricula && form.curso && form.turma; // alunoPEI pode ser false/true
    if (isProfessor) return form.cpf && form.telefone && form.registro && form.disciplina;
    if (isCoordenador) return emailOk; // exige e-mail válido
    return false;
  }, [form, isAluno, isProfessor, isCoordenador, emailOk]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !roleCode) return;

    setSubmitting(true);
    try {
      const payload = { tipo_final: roleCode };
      if (isAluno) Object.assign(payload, { matricula: form.matricula, curso: form.curso, turma: form.turma, alunoPEI: !!form.alunoPEI });
      if (isProfessor) Object.assign(payload, { cpf: form.cpf, telefone: form.telefone, registro: form.registro, disciplina: form.disciplina });
      if (isCoordenador) Object.assign(payload, {});

      await postComplementoCadastro(payload);

      // redireciona para a home do perfil
      if (role === 'Aluno') navigate('/dashboard/aluno');
      else if (role === 'Professor') navigate('/dashboard/professor');
      else if (role === 'Coordenador') navigate('/dashboard/coordenador');
      else navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Falha ao completar cadastro');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="text-success fw-semibold mb-2">Completar cadastro — {role}</h2>
      <p className="text-muted">Precisamos de algumas informações que não vêm da sua conta Google.</p>

      <form onSubmit={submit} className="border rounded p-4 bg-white">
        {isAluno && (
          <>
            <div className="mb-3">
              <label className="form-label">Matrícula</label>
              <input className="form-control" name="matricula" value={form.matricula} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Curso</label>
              <input className="form-control" name="curso" value={form.curso} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Turma</label>
              <input className="form-control" name="turma" value={form.turma} onChange={handleChange} required />
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="alunoPEI" name="alunoPEI" checked={form.alunoPEI} onChange={handleChange} />
              <label className="form-check-label" htmlFor="alunoPEI">Aluno PEI</label>
            </div>
          </>
        )}

        {isProfessor && (
          <>
            <div className="mb-3">
              <label className="form-label">CPF</label>
              <input className="form-control" name="cpf" value={form.cpf} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <input className="form-control" name="telefone" value={form.telefone} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Registro</label>
              <input className="form-control" name="registro" value={form.registro} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Disciplina</label>
              <input className="form-control" name="disciplina" value={form.disciplina} onChange={handleChange} required />
            </div>
          </>
        )}

        {isCoordenador && (
          <div className={`alert ${emailOk ? 'alert-success' : 'alert-warning'} mb-3`}>
            {emailOk
              ? 'Seu e-mail institucional é válido para perfil de Coordenador.'
              : 'Seu e-mail institucional deve seguir o padrão: "<matricula>@<complemento>.restinga.ifrs.edu.br". O sistema validará este padrão ao salvar.'}
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={!canSubmit || submitting}>
            {submitting ? 'Salvando...' : 'Salvar e continuar'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)} disabled={submitting}>
            Voltar
          </button>
        </div>
      </form>
    </main>
  );
}
