import React, { Component } from 'react';
import './Inventario.css';
import HistorialCompras from './HistorialCompras';
import UsuariosVIP from './UsuariosVIP';

class Inventario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      loading: true,
      tabActiva: 'inventario',
      editando: null,
      nuevoProducto: {
        title: '',
        artist: '',
        genre: '',
        rating: 5,
        release_date: '',
        stock: 10
      }
    };
  }

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos = () => {
    fetch('http://localhost:8000/api/albums/', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ productos: data, loading: false });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ loading: false });
      });
  };

  actualizarStock = (id, nuevoStock) => {
    fetch(`http://localhost:8000/api/albums/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...this.state.productos.find(p => p.id === id),
        stock: nuevoStock
      }),
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          productos: this.state.productos.map(p =>
            p.id === id ? data : p
          )
        });
      })
      .catch(error => console.error('Error:', error));
  };

  obtenerEstadoStock = (stock) => {
    if (stock === 0) return { clase: 'sin-stock', texto: 'Sin Stock' };
    if (stock < 5) return { clase: 'stock-bajo', texto: 'Stock Bajo' };
    if (stock < 20) return { clase: 'stock-medio', texto: 'Stock Medio' };
    return { clase: 'stock-alto', texto: 'Stock Alto' };
  };

  render() {
    const { productos, loading, tabActiva } = this.state;

    if (loading && tabActiva === 'inventario') return <p>Cargando inventario...</p>;

    const totalProductos = productos.length;
    const sinStock = productos.filter(p => p.stock === 0).length;
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 5).length;

    return (
      <div className="inventario">
        <button onClick={this.props.onVolver} className="btn-volver">
          ← Volver
        </button>
        
        <div className="admin-header">
          <h1>📦 Panel de Administración</h1>
          <a 
            href="http://127.0.0.1:8000/admin/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-consola"
          >
            🖥️ Ir a Consola
          </a>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${tabActiva === 'inventario' ? 'active' : ''}`}
            onClick={() => this.setState({ tabActiva: 'inventario' })}
          >
            📦 Inventario
          </button>
          <button 
            className={`tab ${tabActiva === 'historial' ? 'active' : ''}`}
            onClick={() => this.setState({ tabActiva: 'historial' })}
          >
            📋 Historial de Compras
          </button>
          <button 
            className={`tab ${tabActiva === 'vip' ? 'active' : ''}`}
            onClick={() => this.setState({ tabActiva: 'vip' })}
          >
            ✨ Usuarios VIP
          </button>
        </div>
        
        {tabActiva === 'inventario' && (
          <>
        <div className="resumen-inventario">
          <div className="stat-card">
            <h3>{totalProductos}</h3>
            <p>Total Productos</p>
          </div>
          <div className="stat-card alerta">
            <h3>{sinStock}</h3>
            <p>Sin Stock</p>
          </div>
          <div className="stat-card warning">
            <h3>{stockBajo}</h3>
            <p>Stock Bajo</p>
          </div>
        </div>

        <div className="tabla-inventario">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Artista</th>
                <th>Género</th>
                <th>Precio</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => {
                const estadoStock = this.obtenerEstadoStock(producto.stock);
                return (
                  <tr key={producto.id}>
                    <td>{producto.title}</td>
                    <td>{producto.artist}</td>
                    <td>{producto.genre}</td>
                    <td>${producto.precio}</td>
                    <td>
                      <span className="rating">⭐ {producto.rating}</span>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={producto.stock}
                        onChange={(e) => this.actualizarStock(producto.id, parseInt(e.target.value) || 0)}
                        className="input-stock"
                        min="0"
                      />
                    </td>
                    <td>
                      <span className={`estado-stock ${estadoStock.clase}`}>
                        {estadoStock.texto}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => this.actualizarStock(producto.id, producto.stock + 10)}
                        className="btn-reabastecer"
                      >
                        +10
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
          </>
        )}
        
        {tabActiva === 'historial' && (
          <HistorialCompras onVolver={null} />
        )}
        
        {tabActiva === 'vip' && (
          <UsuariosVIP />
        )}
      </div>
    );
  }
}

export default Inventario;