import React, { Component } from 'react';
import './DetalleProducto.css';

class DetalleProducto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      producto: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { productoId } = this.props;
    fetch(`http://localhost:8000/api/albums/${productoId}/`)
      .then(res => res.json())
      .then(data => this.setState({ producto: data, loading: false }))
      .catch(error => {
        console.error('Error:', error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { producto, loading } = this.state;

    if (loading) return <p>Cargando...</p>;
    if (!producto) return <p>Producto no encontrado</p>;

    return (
      <div className="detalle-producto">
        <button 
          onClick={this.props.onVolver}
          className="btn-volver"
        >
          ← Volver
        </button>
        
        <div className="producto-detalle">
          <h1>{producto.title}</h1>
          <div className="producto-info">
            <p><strong>Artista:</strong> {producto.artist}</p>
            <p><strong>Género:</strong> {producto.genre}</p>
            <p><strong>Rating:</strong> {producto.rating}/5</p>
            <p><strong>Fecha de Lanzamiento:</strong> {producto.release_date}</p>
          </div>
          
          <div className="producto-acciones">
            <button 
              onClick={() => this.props.onAgregarCarrito(producto)}
              className="btn-agregar-carrito"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DetalleProducto;