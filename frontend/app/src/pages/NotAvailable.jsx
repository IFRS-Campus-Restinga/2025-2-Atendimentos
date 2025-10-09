import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function NotAvailable() {
  const [usuario, setUsuario] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
    setRole(localStorage.getItem('selectedRole') || 'Usuário');
  }, []);

  return (
    <main className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 720 }}>
        <h3 className="mb-3">Olá {role}{usuario?.nome ? ` ${usuario.nome.split(' ')[0]}` : ''}</h3>
        <p className="text-muted mb-4">Esta página ainda não está disponível para o seu perfil.</p>
        <div className="d-flex gap-2">
          <Link to="/selecionar-perfil" className="btn btn-outline-success">Trocar perfil</Link>
          <button
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotAvailable;
