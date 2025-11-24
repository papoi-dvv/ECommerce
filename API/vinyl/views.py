# vinyl/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Album, Categoria, CarritoItem
from .serializers import AlbumSerializer, CategoriaSerializer, CarritoItemSerializer

class IndexView(APIView):
    def get(self, request):
        context = {'mensaje': 'Active API for Vinyl Albums'}
        return Response(context)

class CategoriaView(APIView):
    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)

class AlbumView(APIView):
    def get(self, request):
        categoria_id = request.query_params.get('categoria')
        if categoria_id:
            albums = Album.objects.filter(categoria_id=categoria_id)
        else:
            albums = Album.objects.all()

        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data

        if isinstance(data, list):
            serializer = AlbumSerializer(data=data, many=True)
        else:
            serializer = AlbumSerializer(data=data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=201)

    
class AlbumDetailView(APIView):
    def get_object(self, pk):
        try:
            return Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            return None

    def get(self, request, pk):
        album = self.get_object(pk)
        if album is None:
            return Response({'error': 'Album not found'}, status=404)
        serializer = AlbumSerializer(album)
        return Response(serializer.data)

    def put(self, request, pk):
        album = self.get_object(pk)
        if album is None:
            return Response({'error': 'Album not found'}, status=404)
        serializer = AlbumSerializer(album, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        album = self.get_object(pk)
        if album is None:
            return Response({'error': 'Album not found'}, status=404)
        album.delete()
        return Response(status=204)

@method_decorator(csrf_exempt, name='dispatch')
class CarritoView(APIView):
    def get_session_id(self, request):
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        return session_id

    def get(self, request):
        session_id = self.get_session_id(request)
        items = CarritoItem.objects.filter(session_id=session_id)
        serializer = CarritoItemSerializer(items, many=True)
        
        total = sum(item.cantidad * item.album.precio for item in items)
        
        return Response({
            'items': serializer.data,
            'total': total,
            'cantidad_total': sum(item.cantidad for item in items)
        })

    def post(self, request):
        session_id = self.get_session_id(request)
        album_id = request.data.get('album_id')
        cantidad = request.data.get('cantidad', 1)

        try:
            album = Album.objects.get(id=album_id)
        except Album.DoesNotExist:
            return Response({'error': 'Álbum no encontrado'}, status=404)

        if cantidad > album.stock:
            return Response({'error': f'Stock insuficiente. Disponible: {album.stock}'}, status=400)

        with transaction.atomic():
            item, created = CarritoItem.objects.get_or_create(
                session_id=session_id,
                album=album,
                defaults={'cantidad': cantidad}
            )
            
            if not created:
                nueva_cantidad = item.cantidad + cantidad
                if nueva_cantidad > album.stock:
                    return Response({'error': f'Stock insuficiente. Disponible: {album.stock}'}, status=400)
                item.cantidad = nueva_cantidad
                item.save()

        serializer = CarritoItemSerializer(item)
        return Response(serializer.data, status=201)

    def delete(self, request):
        """Vaciar todo el carrito (checkout)"""
        session_id = self.get_session_id(request)
        items = CarritoItem.objects.filter(session_id=session_id)
        
        # Reducir stock de cada producto
        with transaction.atomic():
            for item in items:
                album = item.album
                if album.stock >= item.cantidad:
                    album.stock -= item.cantidad
                    album.save()
                else:
                    return Response(
                        {'error': f'Stock insuficiente para {album.title}'}, 
                        status=400
                    )
            
            # Eliminar items del carrito
            items.delete()
        
        return Response({'message': 'Compra procesada exitosamente'}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class CarritoItemView(APIView):
    def get_session_id(self, request):
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        return session_id

    def put(self, request, pk):
        session_id = self.get_session_id(request)
        try:
            item = CarritoItem.objects.get(id=pk, session_id=session_id)
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=404)

        nueva_cantidad = request.data.get('cantidad')
        if nueva_cantidad <= 0:
            return Response({'error': 'La cantidad debe ser mayor a 0'}, status=400)
        
        if nueva_cantidad > item.album.stock:
            return Response({'error': f'Stock insuficiente. Disponible: {item.album.stock}'}, status=400)

        item.cantidad = nueva_cantidad
        item.save()
        
        serializer = CarritoItemSerializer(item)
        return Response(serializer.data)

    def delete(self, request, pk):
        session_id = self.get_session_id(request)
        try:
            item = CarritoItem.objects.get(id=pk, session_id=session_id)
            item.delete()
            return Response(status=204)
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=404)