function MissingClientIdNotice() {
  return (
    <div className="container mt-4">
      <div className="alert alert-warning">
        <h4 className="alert-heading">Configuração do Google OAuth ausente</h4>
        <p>
          Defina a variável de ambiente <code>VITE_GOOGLE_CLIENT_ID</code> no arquivo <code>.env</code> dentro de
          <code>frontend/app/</code> e reinicie o servidor de desenvolvimento.
        </p>
        <hr />
        <p className="mb-0">
          Dica: use o Client ID de um "OAuth 2.0 Client ID" do tipo Web no Google Cloud Console e inclua os
          domínios de origem autorizados (por exemplo, http://localhost:5173).
        </p>
      </div>
    </div>
  );
}

export default MissingClientIdNotice;
