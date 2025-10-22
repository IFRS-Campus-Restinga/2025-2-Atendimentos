import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode logar o erro aqui
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI customizada de erro
      return (
        <div className="alert alert-danger m-3">
          <h4>Ops! Algo deu errado.</h4>
          <p>Ocorreu um erro inesperado na aplicação.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Detalhes do erro (clique para expandir)</summary>
            {this.state.error?.toString?.() || String(this.state.error || '')}
            <br />
            {this.state.errorInfo?.componentStack || ''}
          </details>
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;