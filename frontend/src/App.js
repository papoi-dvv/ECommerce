import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import Inventario from "./components/Inventario";
import Categorias from "./components/Categorias";
import ProductosPorCategoria from "./components/ProductosPorCategoria";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Checkout from "./components/Checkout";
import HistorialCompras from "./components/HistorialCompras";
import { useCarrito } from "./hooks/useCarrito";
import { getCurrentUser, useLogout, useUserProfile } from "./hooks/useAuth";

const AppContent = () => {
  const [vistaActual, setVistaActual] = React.useState('home');
  const [productoSeleccionado, setProductoSeleccionado] = React.useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState(null);
  
  const { data: carrito } = useCarrito();
  const logoutMutation = useLogout();
  const usuario = getCurrentUser();
  const { data: userProfile } = useUserProfile();

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

  const mostrarLogin = () => setVistaActual('login');
  const mostrarRegistro = () => setVistaActual('registro');
  const mostrarCheckout = () => setVistaActual('checkout');
  const mostrarHistorial = () => setVistaActual('historial');
  
  const handleLogout = () => {
    logoutMutation.mutate();
    volverHome();
  };

  const cantidadTotal = carrito?.cantidad_total || 0;

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand" onClick={volverHome}>
          <span className="brand-icon">🎵</span>
          <span className="brand-text">MusicStore</span>
        </div>
        
        <div className="nav-pills">
          {userProfile?.es_staff ? (
            <>
              <button 
                className={`nav-pill ${vistaActual === 'historial' ? 'active' : ''}`}
                onClick={mostrarHistorial}
              >
                <span className="pill-icon">📋</span>
                Historial
              </button>
              <button 
                className={`nav-pill admin-pill ${vistaActual === 'inventario' ? 'active' : ''}`}
                onClick={mostrarInventario}
              >
                <span className="pill-icon">📦</span>
                Admin
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-pill ${vistaActual === 'home' ? 'active' : ''}`}
                onClick={volverHome}
              >
                <span className="pill-icon">🏠</span>
                Inicio
              </button>
              
              <button 
                className={`nav-pill ${vistaActual === 'categorias' ? 'active' : ''}`}
                onClick={mostrarCategorias}
              >
                <span className="pill-icon">📂</span>
                Categorías
              </button>
              
              <button 
                className={`nav-pill cart-pill ${vistaActual === 'carrito' ? 'active' : ''}`}
                onClick={mostrarCarrito}
              >
                <span className="pill-icon">🛒</span>
                Carrito
                {cantidadTotal > 0 && <span className="cart-badge">{cantidadTotal}</span>}
              </button>
              
              {usuario && (
                <button 
                  className={`nav-pill ${vistaActual === 'historial' ? 'active' : ''}`}
                  onClick={mostrarHistorial}
                >
                  <span className="pill-icon">📋</span>
                  Historial
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="nav-user">
          {usuario ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="username">{usuario.username}</span>
                {userProfile?.es_vip && (
                  <span className="vip-badge">✨ VIP</span>
                )}
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={mostrarLogin}>
              <span className="pill-icon">🔐</span>
              Iniciar Sesión
            </button>
          )}
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
          <Carrito onVolver={volverHome} onCheckout={usuario ? mostrarCheckout : mostrarLogin} />
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
        
        {vistaActual === 'login' && (
          <Login 
            onVolver={volverHome}
            onCambiarARegistro={mostrarRegistro}
          />
        )}
        
        {vistaActual === 'registro' && (
          <Registro 
            onVolver={volverHome}
            onCambiarALogin={mostrarLogin}
          />
        )}
        
        {vistaActual === 'checkout' && (
          <Checkout 
            onVolver={mostrarCarrito}
            onExito={() => {
              alert('¡Compra realizada exitosamente!');
              volverHome();
            }}
          />
        )}
        
        {vistaActual === 'historial' && (
          <HistorialCompras onVolver={volverHome} />
        )}
      </main>
    </div>
  );
};

class App extends Component {
  render() {
    return <AppContent />;
  }
}

export default App;