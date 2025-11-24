import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductos, fetchProducto, fetchCategorias } from '../services/api';

export const useProductos = (categoriaId = null) => {
  return useQuery({
    queryKey: ['productos', categoriaId],
    queryFn: () => fetchProductos(categoriaId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useProducto = (id) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: () => fetchProducto(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: fetchCategorias,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para prefetch
export const usePrefetch = () => {
  const queryClient = useQueryClient();
  
  const prefetchProducto = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['producto', id],
      queryFn: () => fetchProducto(id),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  const prefetchProductosPorCategoria = (categoriaId) => {
    queryClient.prefetchQuery({
      queryKey: ['productos', categoriaId],
      queryFn: () => fetchProductos(categoriaId),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  return { prefetchProducto, prefetchProductosPorCategoria };
};