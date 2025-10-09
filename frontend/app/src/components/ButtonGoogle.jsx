import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function ButtonGoogle({ onLoginSuccess }) {
  const handleLoginSuccess = (credentialResponse) => {
    if (!credentialResponse?.credential) {
      console.error("Credencial ausente ou inválida");
      return;
    }

    // Chama a função passada pelo App.jsx para atualizar o estado
    onLoginSuccess(credentialResponse);
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.error("Erro ao fazer login com o Google")}
    />
  );
}

export default ButtonGoogle;