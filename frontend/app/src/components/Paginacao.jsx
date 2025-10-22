import React, { useState, useEffect } from "react";
import './Paginacao.css';

function Paginacao({ itens, itensPorPagina = 10, children }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPaginaAtual, setItensPaginaAtual] = useState([]);

  const totalPaginas = Math.ceil(itens.length / itensPorPagina);

  useEffect(() => {
    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    setItensPaginaAtual(itens.slice(start, end));
  }, [itens, paginaAtual, itensPorPagina]);

  const proximaPagina = () => { if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1); };
  const paginaAnterior = () => { if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1); };

  return (
    <div>
      {/* Renderiza os itens da página usando a função children */}
      {children(itensPaginaAtual)}

      {/* Controles de paginação */}
      <div className="paginacao">
        <button onClick={paginaAnterior} disabled={paginaAtual === 1}>Anterior</button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>Próxima</button>
      </div>
    </div>
  );
}

export default Paginacao;
