# vynyl/serializers.py
from rest_framework import serializers
from .models import Album, Categoria, CarritoItem

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

class AlbumSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'rating', 'release_date', 'genre', 'stock', 'precio', 'categoria', 'categoria_nombre']

class CarritoItemSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(read_only=True)
    album_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CarritoItem
        fields = ['id', 'album', 'album_id', 'cantidad', 'subtotal', 'fecha_agregado']
    
    def get_subtotal(self, obj):
        return obj.cantidad * obj.album.precio
    
    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value
    
    def validate(self, data):
        album_id = data.get('album_id')
        cantidad = data.get('cantidad', 1)
        
        try:
            album = Album.objects.get(id=album_id)
            if cantidad > album.stock:
                raise serializers.ValidationError(f"Stock insuficiente. Disponible: {album.stock}")
        except Album.DoesNotExist:
            raise serializers.ValidationError("El álbum no existe")
        
        return data