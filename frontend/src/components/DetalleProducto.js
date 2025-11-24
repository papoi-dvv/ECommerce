import React from 'react';
import { useProducto } from '../hooks/useProductos';
import { useAgregarAlCarrito } from '../hooks/useCarrito';
import './DetalleProducto.css';

const DetalleProducto = ({ productoId, onVolver }) => {
  const { data: producto, isLoading, error } = useProducto(productoId);
  const agregarAlCarritoMutation = useAgregarAlCarrito();

  const handleAgregarCarrito = () => {
    agregarAlCarritoMutation.mutate({
      album_id: producto.id,
      cantidad: 1
    });
  };

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!producto) return <div className="error">Producto no encontrado</div>;

  const precioFinal = producto.genre === 'Rock' 
    ? (producto.precio * 0.8).toFixed(2)
    : producto.precio;

  return (
    <div className="detalle-producto">
      <button onClick={onVolver} className="btn-volver">
        ← Volver
      </button>
      
      <div className="producto-detalle">
        <h1>{producto.title}</h1>
        <div className="producto-info">
          <p><strong>Artista:</strong> {producto.artist}</p>
          <p><strong>Género:</strong> {producto.genre}</p>
          <p><strong>Rating:</strong> {producto.rating}/5</p>
          <p><strong>Fecha de Lanzamiento:</strong> {producto.release_date}</p>
          <p><strong>Stock disponible:</strong> {producto.stock}</p>
          <p className="precio-detalle">
            <strong>Precio:</strong> ${precioFinal}
            {producto.genre === 'Rock' && (
              <span className="descuento-detalle">20% OFF</span>
            )}
          </p>
        </div>
        
        <div className="producto-acciones">
          <button 
            onClick={handleAgregarCarrito}
            className="btn-agregar-carrito"
            disabled={producto.stock === 0 || agregarAlCarritoMutation.isPending}
          >
            {agregarAlCarritoMutation.isPending 
              ? 'Agregando al Carrito...' 
              : producto.stock === 0 
                ? 'Sin Stock' 
                : 'Agregar al Carrito'
            }
          </button>
        </div>
        
        {agregarAlCarritoMutation.error && (
          <div className="error-message">
            {agregarAlCarritoMutation.error.message}
          </div>
        )}
        
        {agregarAlCarritoMutation.isSuccess && (
          <div className="success-message">
            ¡Producto agregado al carrito exitosamente!
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleProducto;