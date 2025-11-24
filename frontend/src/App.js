import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import Inventario from "./components/Inventario";
import Categorias from "./components/Categorias";
import ProductosPorCategoria from "./components/ProductosPorCategoria";
import { useCarrito } from "./hooks/useCarrito";

// Componente funcional para usar hooks
const AppContent = () => {
  const [vistaActual, setVistaActual] = React.useState('home');
  const [productoSeleccionado, setProductoSeleccionado] = React.useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState(null);
  
  const { data: carrito } = useCarrito();

  const mostrarDetalle = (productoId) => {
    setVistaActual('detalle');
    setProductoSeleccionado(productoId);
  };

  const mostrarCarrito = () => {
    setVistaActual('carrito');
  };

  const mostrarInventario = () => {
    setVistaActual('inventario');
  };

  const mostrarCategorias = () => {
    setVistaActual('categorias');
  };

  const mostrarProductosPorCategoria = (categoriaId, categoriaNombre) => {
    setCategoriaSeleccionada({ id: categoriaId, nombre: categoriaNombre });
    setVistaActual('productos-categoria');
  };

  const volverHome = () => {
    setVistaActual('home');
    setProductoSeleccionado(null);
    setCategoriaSeleccionada(null);
  };

  const volverCategorias = () => {
    setVistaActual('categorias');
    setCategoriaSeleccionada(null);
  };

  const cantidadTotal = carrito?.cantidad_total || 0;

  return (
    <div className="App">
      <nav className="navbar">
        <h2 onClick={volverHome} style={{cursor: 'pointer'}}>🎵 MusicStore</h2>
        <div className="nav-buttons">
          <button onClick={volverHome}>Inicio</button>
          <button onClick={mostrarCategorias}>Categorías</button>
          <button onClick={mostrarCarrito}>
            Carrito ({cantidadTotal})
          </button>
          <button onClick={mostrarInventario} className="btn-admin">
            📦 Inventario
          </button>
        </div>
      </nav>

      <main>
        {vistaActual === 'home' && (
          <Home onVerDetalle={mostrarDetalle} />
        )}
        
        {vistaActual === 'detalle' && (
          <DetalleProducto 
            productoId={productoSeleccionado}
            onVolver={volverHome}
          />
        )}
        
        {vistaActual === 'carrito' && (
          <Carrito onVolver={volverHome} />
        )}
        
        {vistaActual === 'inventario' && (
          <Inventario onVolver={volverHome} />
        )}
        
        {vistaActual === 'categorias' && (
          <Categorias 
            onSeleccionarCategoria={mostrarProductosPorCategoria}
            onVolver={volverHome}
          />
        )}
        
        {vistaActual === 'productos-categoria' && categoriaSeleccionada && (
          <ProductosPorCategoria 
            categoriaId={categoriaSeleccionada.id}
            categoriaNombre={categoriaSeleccionada.nombre}
            onVerDetalle={mostrarDetalle}
            onVolver={volverCategorias}
          />
        )}
      </main>
    </div>
  );
};

// Wrapper de clase para mantener compatibilidad
class App extends Component {
  render() {
    return <AppContent />;
  }
}

export default App;