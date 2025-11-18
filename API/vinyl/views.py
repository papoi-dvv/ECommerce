# vinyl/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Album
from .serializers import AlbumSerializer

class IndexView(APIView):
    def get(self, request):
        context = {'mensaje': 'Active API for Vinyl Albums'}
        return Response(context)
    
class AlbumView(APIView):
    def get(self, request):
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        album = AlbumSerializer(data=request.data)
        album.is_valid(raise_exception=True)
        album.save()
        return Response(album.data, status=201)
    
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