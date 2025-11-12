import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfileExtras, updateMyProfileExtras } from '../../services/api';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const usuario = useMemo(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [form, setForm] = useState({
    avatar: null,
    avatar_url: '',
    bio: '',
    data_nascimento: '',
    localizacao: '',
    website: '',
    instagram: '',
    linkedin: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const extras = await getMyProfileExtras();
        if (!active) return;
        setForm({
          avatar: null,
          avatar_url: extras.avatar_url || '',
          bio: extras.bio || '',
          data_nascimento: extras.data_nascimento || '',
          localizacao: extras.localizacao || '',
          website: extras.website || '',
          instagram: extras.instagram || '',
          linkedin: extras.linkedin || ''
        });
        setPreviewUrl(extras.avatar_url || usuario?.foto || '');
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, avatar: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      if (form.avatar) fd.append('avatar', form.avatar);
      if (form.bio !== undefined) fd.append('bio', form.bio);
      if (form.data_nascimento) fd.append('data_nascimento', form.data_nascimento);
      if (form.localizacao !== undefined) fd.append('localizacao', form.localizacao);
      if (form.website !== undefined) fd.append('website', form.website);
      if (form.instagram !== undefined) fd.append('instagram', form.instagram);
      if (form.linkedin !== undefined) fd.append('linkedin', form.linkedin);

      const data = await updateMyProfileExtras(fd);
      setPreviewUrl(data.avatar_url || previewUrl);
      // Atualiza foto usada no header, se existir
      if (data.avatar_url) {
        const raw = localStorage.getItem('usuario');
        if (raw) {
          const updated = { ...JSON.parse(raw), foto: data.avatar_url };
          localStorage.setItem('usuario', JSON.stringify(updated));
          // dispara evento para Header atualizar
          window.dispatchEvent(new StorageEvent('storage', { key: 'usuario', newValue: JSON.stringify(updated) }));
        }
      }
      // Não alteramos nome/matrícula aqui.
      navigate(-1);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container py-4"><p>Carregando…</p></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">Editar perfil</h2>
      <p className="text-muted">Informações opcionais. Seu nome e matrícula são gerenciados pelo sistema.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src={previewUrl || 'https://via.placeholder.com/96?text=Avatar'}
            alt="Pré-visualização do avatar"
            className="rounded-circle border"
            style={{ width: 96, height: 96, objectFit: 'cover' }}
          />
          <div>
            <label className="form-label">Foto de perfil</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
            <small className="text-muted">PNG ou JPG. Opcional.</small>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea className="form-control" name="bio" rows={3} value={form.bio} onChange={handleChange} />
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Data de nascimento</label>
            <input type="date" className="form-control" name="data_nascimento" value={form.data_nascimento || ''} onChange={handleChange} />
          </div>
          <div className="col-md-8">
            <label className="form-label">Localização</label>
            <input type="text" className="form-control" name="localizacao" value={form.localizacao} onChange={handleChange} placeholder="Cidade/UF" />
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label">Website</label>
            <input type="url" className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://…" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Instagram</label>
            <input type="text" className="form-control" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@usuario" />
          </div>
          <div className="col-md-3">
            <label className="form-label">LinkedIn</label>
            <input type="url" className="form-control" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/…" />
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
