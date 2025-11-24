# vinyl/models.py
from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    
    def __str__(self):
        return self.nombre

class Album(models.Model):
    POP = 'Pop'
    ROCK = 'Rock'
    INDIE = 'Indie'
    REGGAETON = 'Reggaeton'
    SALSA = 'Salsa'
    HIP_HOP = 'Hip Hop'
    DEMBOW = 'Dembow'
    BACHATA = 'Bachata'

    GENRE_CHOICES = [
        (POP, 'Pop'),
        (ROCK, 'Rock'),
        (INDIE, 'Indie'),
        (REGGAETON, 'Reggaeton'),
        (SALSA, 'Salsa'),
        (HIP_HOP, 'Hip Hop'),
        (DEMBOW, 'Dembow'),
        (BACHATA, 'Bachata'),
    ]

    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    rating = models.IntegerField(default=0)
    release_date = models.DateField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    stock = models.IntegerField(default=10)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=25.99)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class CarritoItem(models.Model):
    session_id = models.CharField(max_length=100)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session_id', 'album']
    
    def __str__(self):
        return f"{self.cantidad}x {self.album.title}"