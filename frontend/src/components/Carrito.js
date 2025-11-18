import React, { Component } from 'react';
import './Carrito.css';

class Carrito extends Component {
  calcularTotal = () => {
    return this.props.carrito.reduce((total, item) => {
      return total + (item.cantidad * (item.precio || 25.99));
    }, 0).toFixed(2);
  };

  render() {
    const { carrito, onActualizarCantidad, onEliminarItem, onVolver } = this.props;

    return (
      <div className="carrito">
        <button onClick={onVolver} className="btn-volver">
          ← Volver
        </button>
        
        <h1>Carrito de Compras</h1>
        
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <div>
            <div className="carrito-items">
              {carrito.map(item => (
                <div key={item.id} className="carrito-item">
                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p>{item.artist}</p>
                    <p className="precio">${item.precio || 25.99}</p>
                  </div>
                  
                  <div className="item-controles">
                    <button 
                      onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <span className="cantidad">{item.cantidad}</span>
                    <button 
                      onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => onEliminarItem(item.id)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="carrito-total">
              <h2>Total: ${this.calcularTotal()}</h2>
              <button className="btn-comprar" disabled>
                Proceder al Pago (Próximamente)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Carrito;