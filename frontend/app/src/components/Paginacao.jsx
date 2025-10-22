import React, { useState, useEffect, useMemo } from "react";
import './Paginacao.css';

function Paginacao({ itens, itensPorPagina = 10, children }) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Calcula o total de páginas apenas quando itens ou itensPorPagina mudarem
  const totalPaginas = useMemo(() => Math.ceil(itens.length / itensPorPagina), [itens, itensPorPagina]);

  // Reseta a página atual se a lista de itens mudar e a página atual ficar fora do intervalo
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(1);
  }, [itens, totalPaginas, paginaAtual]);

  // Calcula os itens da página atual
  const itensPaginaAtual = useMemo(() => {
    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    return itens.slice(start, end);
  }, [itens, paginaAtual, itensPorPagina]);

  const proximaPagina = () => { 
    if (paginaAtual < totalPaginas) setPaginaAtual(prev => prev + 1); 
  };
  const paginaAnterior = () => { 
    if (paginaAtual > 1) setPaginaAtual(prev => prev - 1); 
  };

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
