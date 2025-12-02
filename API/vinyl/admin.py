from django.contrib import admin
from .models import Album, Categoria, CarritoItem, Compra, CompraItem, Usuario

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'categoria', 'stock', 'precio', 'rating']
    list_filter = ['categoria', 'genre', 'BESTSELLER']
    search_fields = ['title', 'artist']
    list_editable = ['stock', 'precio']

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion']

@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'fecha', 'total']
    list_filter = ['fecha']
    readonly_fields = ['fecha']

@admin.register(CompraItem)
class CompraItemAdmin(admin.ModelAdmin):
    list_display = ['compra', 'album', 'cantidad', 'precio_unitario']

@admin.register(CarritoItem)
class CarritoItemAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'album', 'cantidad', 'fecha_agregado']

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'VIP']
    list_filter = ['VIP']
