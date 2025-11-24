# vinyl/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('albums/', views.AlbumView.as_view(), name='albums'),
    path('albums/<int:pk>/', views.AlbumDetailView.as_view(), name='album-detail'),
    path('categorias/', views.CategoriaView.as_view(), name='categorias'),
    path('carrito/', views.CarritoView.as_view(), name='carrito'),
    path('carrito/checkout/', views.CarritoView.as_view(), name='carrito-checkout'),
    path('carrito/<int:pk>/', views.CarritoItemView.as_view(), name='carrito-item'),
]