import React, { useState } from 'react';
import { useProductos, usePrefetch } from '../hooks/useProductos';
import { useAgregarAlCarrito } from '../hooks/useCarrito';
import { useUserProfile } from '../hooks/useAuth';
import './Home.css';

const Home = ({ onVerDetalle }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  
  const { data: productos, isLoading, error } = useProductos();
  const { prefetchProducto } = usePrefetch();
  const agregarAlCarritoMutation = useAgregarAlCarrito();
  const { data: userProfile } = useUserProfile();

  const handleMouseEnter = (productoId) => {
    prefetchProducto(productoId);
  };

  const handleAgregarCarrito = (producto) => {
    agregarAlCarritoMutation.mutate({
      album_id: producto.id,
      cantidad: 1
    });
  };

  const filtrarProductos = () => {
    if (!productos) return [];
    
    let filtrados = productos;

    if (busqueda) {
      filtrados = filtrados.filter(p => 
        p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.artist.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroGenero) {
      filtrados = filtrados.filter(p => p.genre === filtroGenero);
    }

    return filtrados;
  };

  const obtenerPrecio = (producto) => {
    const esVIP = userProfile?.es_vip;
    const descuentoRock = producto.genre === 'Rock' ? 0.2 : 0;
    const descuentoVIP = esVIP ? 0.3 : 0;
    const descuentoTotal = Math.max(descuentoRock, descuentoVIP);
    return (producto.precio * (1 - descuentoTotal)).toFixed(2);
  };

  const obtenerDescuento = (producto) => {
    const esVIP = userProfile?.es_vip;
    if (esVIP) return { texto: '✨ 30% OFF VIP', clase: 'vip' };
    if (producto.genre === 'Rock') return { texto: '20% OFF', clase: '' };
    return null;
  };

  const obtenerRecomendados = (productos) => {
    return productos
      .filter(p => p.rating >= 8)
      .slice(0, 3);
  };

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const productosFiltrados = filtrarProductos();
  const recomendados = obtenerRecomendados(productosFiltrados);
  const generos = [...new Set(productos?.map(p => p.genre) || [])];

  const esVIP = userProfile?.es_vip;
  const promociones = [
    { id: 1, texto: '🎵 ¡20% OFF en álbumes de Rock!', activa: !esVIP },
    { id: 2, texto: '✨ ¡30% OFF en TODO por ser VIP!', activa: esVIP },
    { id: 3, texto: '🔥 Envío gratis en compras +$50', activa: true }
  ];

  return (
    <div className="home">
      {/* Banner de promociones */}
      <div className="promociones-banner">
        {promociones.filter(p => p.activa).map(promo => (
          <div key={promo.id} className="promocion">{promo.texto}</div>
        ))}
      </div>

      <h1>Tienda de Música</h1>
      
      {/* Controles de búsqueda y filtros */}
      <div className="controles">
        <input
          type="text"
          placeholder="Buscar por título o artista..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda"
        />
        <select 
          value={filtroGenero} 
          onChange={(e) => setFiltroGenero(e.target.value)} 
          className="filtro"
        >
          <option value="">Todos los géneros</option>
          {generos.map(genero => (
            <option key={genero} value={genero}>{genero}</option>
          ))}
        </select>
      </div>

      {/* Productos recomendados */}
      {recomendados.length > 0 && (
        <div className="recomendados">
          <h2>🌟 Recomendados para ti</h2>
          <div className="productos-grid">
            {recomendados.map(producto => (
              <div 
                key={`rec-${producto.id}`} 
                className="producto-card recomendado"
                onMouseEnter={() => handleMouseEnter(producto.id)}
              >
                <div className="badge-recomendado">⭐ TOP</div>
                <h3>{producto.title}</h3>
                <p><strong>Artista:</strong> {producto.artist}</p>
                <p><strong>Género:</strong> {producto.genre}</p>
                <p><strong>Rating:</strong> {producto.rating}/10</p>
                <p className="precio">${obtenerPrecio(producto)}</p>
                {obtenerDescuento(producto) && (
                  <span className={`descuento ${obtenerDescuento(producto).clase}`}>
                    {obtenerDescuento(producto).texto}
                  </span>
                )}
                <div className="producto-actions">
                  <button 
                    onClick={() => onVerDetalle(producto.id)} 
                    className="btn-detalle"
                  >
                    Ver Detalle
                  </button>
                  <button 
                    onClick={() => handleAgregarCarrito(producto)}
                    className="btn-carrito"
                    disabled={producto.stock === 0 || agregarAlCarritoMutation.isPending}
                  >
                    {agregarAlCarritoMutation.isPending ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos los productos */}
      <div className="todos-productos">
        <h2>Todos los Productos ({productosFiltrados.length})</h2>
        <div className="productos-grid">
          {productosFiltrados.map(producto => (
            <div 
              key={producto.id} 
              className="producto-card"
              onMouseEnter={() => handleMouseEnter(producto.id)}
            >
              <h3>{producto.title}</h3>
              <p><strong>Artista:</strong> {producto.artist}</p>
              <p><strong>Género:</strong> {producto.genre}</p>
              <p><strong>Rating:</strong> {producto.rating}/10</p>
              <p className="precio">${obtenerPrecio(producto)}</p>
              {obtenerDescuento(producto) && (
                <span className={`descuento ${obtenerDescuento(producto).clase}`}>
                  {obtenerDescuento(producto).texto}
                </span>
              )}
              <div className="producto-actions">
                <button 
                  onClick={() => onVerDetalle(producto.id)} 
                  className="btn-detalle"
                >
                  Ver Detalle
                </button>
                <button 
                  onClick={() => handleAgregarCarrito(producto)}
                  className="btn-carrito"
                  disabled={producto.stock === 0 || agregarAlCarritoMutation.isPending}
                >
                  {agregarAlCarritoMutation.isPending ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
              </div>
              {producto.stock === 0 && (
                <div className="sin-stock">Sin Stock</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {agregarAlCarritoMutation.error && (
        <div className="error-message">
          {agregarAlCarritoMutation.error.message}
        </div>
      )}
    </div>
  );
};

export default Home;