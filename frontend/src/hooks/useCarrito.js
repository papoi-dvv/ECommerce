import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCarrito, agregarAlCarrito, actualizarCantidadCarrito, eliminarDelCarrito, procesarCompra } from '../services/api';

export const useCarrito = () => {
  return useQuery({
    queryKey: ['carrito'],
    queryFn: fetchCarrito,
    staleTime: 0, // Siempre fresh para el carrito
  });
};

export const useAgregarAlCarrito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: agregarAlCarrito,
    onMutate: async (newItem) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      
      // Snapshot del estado anterior
      const previousCarrito = queryClient.getQueryData(['carrito']);
      
      // Optimistic update
      queryClient.setQueryData(['carrito'], (old) => {
        if (!old) return old;
        
        const existingItem = old.items.find(item => item.album.id === newItem.album_id);
        
        if (existingItem) {
          return {
            ...old,
            items: old.items.map(item => 
              item.album.id === newItem.album_id 
                ? { ...item, cantidad: item.cantidad + newItem.cantidad }
                : item
            ),
            cantidad_total: old.cantidad_total + newItem.cantidad,
            total: old.total + (newItem.cantidad * 25.99) // precio estimado
          };
        } else {
          return {
            ...old,
            items: [...old.items, {
              id: Date.now(), // ID temporal
              album: { id: newItem.album_id },
              cantidad: newItem.cantidad,
              subtotal: newItem.cantidad * 25.99
            }],
            cantidad_total: old.cantidad_total + newItem.cantidad,
            total: old.total + (newItem.cantidad * 25.99)
          };
        }
      });
      
      return { previousCarrito };
    },
    onError: (err, newItem, context) => {
      // Rollback en caso de error
      queryClient.setQueryData(['carrito'], context.previousCarrito);
    },
    onSettled: () => {
      // Invalidar y refetch
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};

export const useActualizarCantidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: actualizarCantidadCarrito,
    onMutate: async ({ id, cantidad }) => {
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      
      const previousCarrito = queryClient.getQueryData(['carrito']);
      
      queryClient.setQueryData(['carrito'], (old) => {
        if (!old) return old;
        
        return {
          ...old,
          items: old.items.map(item => 
            item.id === id 
              ? { ...item, cantidad, subtotal: cantidad * item.album.precio }
              : item
          )
        };
      });
      
      return { previousCarrito };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['carrito'], context.previousCarrito);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};

export const useEliminarDelCarrito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eliminarDelCarrito,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      
      const previousCarrito = queryClient.getQueryData(['carrito']);
      
      queryClient.setQueryData(['carrito'], (old) => {
        if (!old) return old;
        
        return {
          ...old,
          items: old.items.filter(item => item.id !== id)
        };
      });
      
      return { previousCarrito };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['carrito'], context.previousCarrito);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};

export const useProcesarCompra = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: procesarCompra,
    onSuccess: () => {
      queryClient.setQueryData(['carrito'], {
        items: [],
        total: 0,
        cantidad_total: 0
      });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};