import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      loading: true,
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/api/albums/')
      .then(res => res.json())
      .then(data => this.setState({ productos: data, loading: false }))
      .catch(error => {
        console.error('Error:', error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { productos, loading } = this.state;

    return (
      <div className="home">
        <h1>Tienda de Música</h1>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="productos-grid">
            {productos.map(producto => (
              <div key={producto.id} className="producto-card">
                <h3>{producto.title}</h3>
                <p><strong>Artista:</strong> {producto.artist}</p>
                <p><strong>Género:</strong> {producto.genre}</p>
                <p><strong>Rating:</strong> {producto.rating}/5</p>
                <div className="producto-actions">
                  <button 
                    onClick={() => this.props.onVerDetalle(producto.id)}
                    className="btn-detalle"
                  >
                    Ver Detalle
                  </button>
                  <button 
                    onClick={() => this.props.onAgregarCarrito(producto)}
                    className="btn-carrito"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Home;