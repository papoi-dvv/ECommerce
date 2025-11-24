import React, { Component } from 'react';
import './Inventario.css';

class Inventario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      loading: true,
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
    fetch('http://localhost:8000/api/albums/')
      .then(res => res.json())
      .then(data => {
        const productosConStock = data.map(p => ({
          ...p,
          stock: Math.floor(Math.random() * 50) + 1
        }));
        this.setState({ productos: productosConStock, loading: false });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ loading: false });
      });
  };

  actualizarStock = (id, nuevoStock) => {
    this.setState({
      productos: this.state.productos.map(p =>
        p.id === id ? { ...p, stock: nuevoStock } : p
      )
    });
  };

  obtenerEstadoStock = (stock) => {
    if (stock === 0) return { clase: 'sin-stock', texto: 'Sin Stock' };
    if (stock < 5) return { clase: 'stock-bajo', texto: 'Stock Bajo' };
    if (stock < 20) return { clase: 'stock-medio', texto: 'Stock Medio' };
    return { clase: 'stock-alto', texto: 'Stock Alto' };
  };

  render() {
    const { productos, loading } = this.state;

    if (loading) return <p>Cargando inventario...</p>;

    const totalProductos = productos.length;
    const sinStock = productos.filter(p => p.stock === 0).length;
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 5).length;

    return (
      <div className="inventario">
        <button onClick={this.props.onVolver} className="btn-volver">
          ← Volver
        </button>
        
        <h1>📦 Gestión de Inventario</h1>
        
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
      </div>
    );
  }
}

export default Inventario;