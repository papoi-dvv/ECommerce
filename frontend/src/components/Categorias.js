import React from 'react';
import { useCategorias, usePrefetch } from '../hooks/useProductos';
import './Categorias.css';

const Categorias = ({ onSeleccionarCategoria, onVolver }) => {
  const { data: categorias, isLoading, error } = useCategorias();
  const { prefetchProductosPorCategoria } = usePrefetch();

  const handleMouseEnter = (categoriaId) => {
    prefetchProductosPorCategoria(categoriaId);
  };

  if (isLoading) return <div className="loading">Cargando categorías...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="categorias">
      <button onClick={onVolver} className="btn-volver">
        ← Volver
      </button>
      
      <h1>🏷️ Categorías</h1>
      
      <div className="categorias-grid">
        {categorias?.map(categoria => (
          <div 
            key={categoria.id} 
            className="categoria-card"
            onMouseEnter={() => handleMouseEnter(categoria.id)}
            onClick={() => onSeleccionarCategoria(categoria.id, categoria.nombre)}
          >
            <h3>{categoria.nombre}</h3>
            {categoria.descripcion && (
              <p>{categoria.descripcion}</p>
            )}
            <div className="categoria-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;