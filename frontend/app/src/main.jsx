import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import MissingClientIdNotice from './components/MissingClientIdNotice.jsx';

// Only use env var; do NOT fall back to a hardcoded client id (prevents invalid origin errors).
const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Basic sanity check for a Google OAuth Web Client ID format
const isLikelyGoogleClientId = (id) =>
  typeof id === 'string' && /\.apps\.googleusercontent\.com$/.test(id);

const clientId = isLikelyGoogleClientId(rawClientId) ? rawClientId : undefined;

if (!clientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set or invalid. Google OAuth will be disabled.');
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    {clientId ? (
      // Keep Provider OUTSIDE StrictMode to avoid double-mount script issues in dev.
      <GoogleOAuthProvider clientId={clientId}>
        <StrictMode>
          <App />
        </StrictMode>
      </GoogleOAuthProvider>
    ) : (
      <MissingClientIdNotice />
    )}
  </ErrorBoundary>
);