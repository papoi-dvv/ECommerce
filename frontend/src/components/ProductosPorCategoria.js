import React from 'react';
import { useProductos, usePrefetch } from '../hooks/useProductos';
import { useAgregarAlCarrito } from '../hooks/useCarrito';
import './ProductosPorCategoria.css';

const ProductosPorCategoria = ({ categoriaId, categoriaNombre, onVerDetalle, onVolver }) => {
  const { data: productos, isLoading, error } = useProductos(categoriaId);
  const { prefetchProducto } = usePrefetch();
  const agregarAlCarritoMutation = useAgregarAlCarrito();

  const handleMouseEnter = (productoId) => {
    prefetchProducto(productoId);
  };

  const handleAgregarCarrito = (producto) => {
    agregarAlCarritoMutation.mutate({
      album_id: producto.id,
      cantidad: 1
    });
  };

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="productos-categoria">
      <button onClick={onVolver} className="btn-volver">
        ← Volver a Categorías
      </button>
      
      <h1>🎵 {categoriaNombre}</h1>
      <p className="categoria-info">{productos?.length || 0} productos encontrados</p>
      
      {productos?.length === 0 ? (
        <div className="sin-productos">
          <p>No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productos?.map(producto => (
            <div 
              key={producto.id} 
              className="producto-card"
              onMouseEnter={() => handleMouseEnter(producto.id)}
            >
              <h3>{producto.title}</h3>
              <p><strong>Artista:</strong> {producto.artist}</p>
              <p><strong>Género:</strong> {producto.genre}</p>
              <p><strong>Rating:</strong> {producto.rating}/5</p>
              <p className="precio">${producto.precio}</p>
              <p className="stock">Stock: {producto.stock}</p>
              
              <div className="producto-actions">
                <button 
                  onClick={() => onVerDetalle(producto.id)}
                  className="btn-detalle"
                >
                  Ver Detalle
                </button>
                <button 
                  onClick={() => handleAgregarCarrito(producto)}
                  className="btn-carrito"
                  disabled={producto.stock === 0 || agregarAlCarritoMutation.isPending}
                >
                  {agregarAlCarritoMutation.isPending ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
              </div>
              
              {producto.stock === 0 && (
                <div className="sin-stock">Sin Stock</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosPorCategoria;