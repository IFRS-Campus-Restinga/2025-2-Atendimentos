import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

function ButtonGoogle({ onLoginSuccess }) {
  const [error, setError] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Credencial ausente ou inválida");
      }

      console.log("Login realizado com sucesso:", credentialResponse);
      setError(null); // Limpa qualquer erro anterior
      
      // Chama a função passada pelo App.jsx para atualizar o estado
      onLoginSuccess(credentialResponse);
    } catch (err) {
      console.error("Erro no handleLoginSuccess:", err);
      setError(err.message);
    }
  };

  const handleLoginError = (error) => {
    console.error("Erro ao fazer login com o Google:", error);
    setError("Falha no login com Google. Tente novamente.");
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap={false}
        auto_select={false}
      />
    </div>
  );
}

export default ButtonGoogle;