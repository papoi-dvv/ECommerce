import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vistaActual: 'home',
      productoSeleccionado: null,
      carrito: [],
    };
  }

  mostrarDetalle = (productoId) => {
    this.setState({
      vistaActual: 'detalle',
      productoSeleccionado: productoId
    });
  };

  mostrarCarrito = () => {
    this.setState({ vistaActual: 'carrito' });
  };

  volverHome = () => {
    this.setState({ vistaActual: 'home' });
  };

  agregarAlCarrito = (producto) => {
    const { carrito } = this.state;
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
      this.setState({
        carrito: carrito.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      });
    } else {
      this.setState({
        carrito: [...carrito, { ...producto, cantidad: 1, precio: 25.99 }]
      });
    }
    
    alert('Producto agregado al carrito!');
  };

  actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    
    this.setState({
      carrito: this.state.carrito.map(item => 
        item.id === productoId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    });
  };

  eliminarDelCarrito = (productoId) => {
    this.setState({
      carrito: this.state.carrito.filter(item => item.id !== productoId)
    });
  };

  render() {
    const { vistaActual, productoSeleccionado, carrito } = this.state;

    return (
      <div className="App">
        <nav className="navbar">
          <h2 onClick={this.volverHome} style={{cursor: 'pointer'}}>🎵 MusicStore</h2>
          <div className="nav-buttons">
            <button onClick={this.volverHome}>Inicio</button>
            <button onClick={this.mostrarCarrito}>
              Carrito ({carrito.reduce((total, item) => total + item.cantidad, 0)})
            </button>
          </div>
        </nav>

        <main>
          {vistaActual === 'home' && (
            <Home 
              onVerDetalle={this.mostrarDetalle}
              onAgregarCarrito={this.agregarAlCarrito}
            />
          )}
          
          {vistaActual === 'detalle' && (
            <DetalleProducto 
              productoId={productoSeleccionado}
              onVolver={this.volverHome}
              onAgregarCarrito={this.agregarAlCarrito}
            />
          )}
          
          {vistaActual === 'carrito' && (
            <Carrito 
              carrito={carrito}
              onVolver={this.volverHome}
              onActualizarCantidad={this.actualizarCantidad}
              onEliminarItem={this.eliminarDelCarrito}
            />
          )}
        </main>
      </div>
    );
  }
}

export default App;
