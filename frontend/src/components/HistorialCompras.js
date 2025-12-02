import React from 'react';
import { useHistorialCompras } from '../hooks/useAuth';
import './HistorialCompras.css';

const HistorialCompras = ({ onVolver }) => {
  const { data: compras, isLoading, error } = useHistorialCompras();

  if (isLoading) return <div className="loading">Cargando historial...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="historial-container">
      <button onClick={onVolver} className="btn-volver">
        ← Volver
      </button>
      
      <h1>📋 Historial de Compras</h1>
      
      {!compras || compras.length === 0 ? (
        <div className="sin-compras">
          <p>No tienes compras realizadas aún</p>
          <button onClick={onVolver} className="btn-seguir-comprando">
            Ir a Comprar
          </button>
        </div>
      ) : (
        <div className="compras-lista">
          {compras.map(compra => (
            <div key={compra.id} className="compra-card">
              <div className="compra-header">
                <h3>Compra #{compra.id}</h3>
                <div className="compra-fecha">
                  {new Date(compra.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div className="compra-items">
                {compra.items.map((item, index) => (
                  <div key={index} className="compra-item">
                    <div className="item-info">
                      <strong>{item.album.title}</strong>
                      <span>por {item.album.artist}</span>
                    </div>
                    <div className="item-cantidad">
                      {item.cantidad}x ${item.precio_unitario}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="compra-total">
                <strong>Total: ${compra.total}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialCompras;