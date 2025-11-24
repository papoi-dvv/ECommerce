const API_BASE = 'http://localhost:8000/api';

// Productos
export const fetchProductos = async (categoriaId = null) => {
  const url = categoriaId 
    ? `${API_BASE}/albums/?categoria=${categoriaId}`
    : `${API_BASE}/albums/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar productos');
  return response.json();
};

export const fetchProducto = async (id) => {
  const response = await fetch(`${API_BASE}/albums/${id}/`);
  if (!response.ok) throw new Error('Error al cargar producto');
  return response.json();
};

// Categorías
export const fetchCategorias = async () => {
  const response = await fetch(`${API_BASE}/categorias/`);
  if (!response.ok) throw new Error('Error al cargar categorías');
  return response.json();
};

// Carrito
export const fetchCarrito = async () => {
  const response = await fetch(`${API_BASE}/carrito/`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Error al cargar carrito');
  return response.json();
};

export const agregarAlCarrito = async ({ album_id, cantidad = 1 }) => {
  const response = await fetch(`${API_BASE}/carrito/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ album_id, cantidad }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al agregar al carrito');
  }
  return response.json();
};

export const actualizarCantidadCarrito = async ({ id, cantidad }) => {
  const response = await fetch(`${API_BASE}/carrito/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ cantidad }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar cantidad');
  }
  return response.json();
};

export const eliminarDelCarrito = async (id) => {
  const response = await fetch(`${API_BASE}/carrito/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Error al eliminar del carrito');
  return true;
};

export const procesarCompra = async () => {
  const response = await fetch(`${API_BASE}/carrito/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al procesar la compra');
  }
  return response.json();
};