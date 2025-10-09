import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "854138693145-hlgec9e2pnoc4cj2tkcknl5rp1bei7m2.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);