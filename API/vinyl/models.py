# vinyl/models.py
from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    VIP = models.BooleanField(default=False) # Si compra más de 5 álbumes, se vuelve VIP

    def __str__(self):
        return self.username

class Album(models.Model):
    NN = 'NN'
    # --- Rock y derivados ---
    ROCK = 'Rock'
    INDIE_ROCK = 'Indie Rock'
    INDIE_POP = 'Indie Pop'
    ALTERNATIVE_ROCK = 'Alternative Rock'
    METAL = 'Metal'
    PUNK = 'Punk'

# --- Pop y derivados ---
    POP = 'Pop'
    JPOP = 'J-pop'
    KPOP = 'K-pop'

# --- Jazz / Blues / Soul ---
    JAZZ = 'Jazz'
    BLUES = 'Blues'
    DISCO = 'Disco'

# --- Música Latina ---
    SALSA = 'Salsa'
    BACHATA = 'Bachata'
    REGGAETON = 'Reggaeton'
    CUMBIA = 'Cumbia'
    DEMBOW = 'Dembow'
    BOLERO = 'Bolero'

# --- Electrónica ---
    ELECTRONICA = 'Electronica'
    TECHNO = 'Techno'

# --- Hip Hop / Reggae ---
    HIP_HOP = 'Hip Hop'
    REGGAE = 'Reggae'
    TRAP = 'Trap'

    GENRE_CHOICES = [
        (NN, 'No definido'),
        # --- Rock y derivados ---
        (ROCK, 'Rock'),
        (INDIE_ROCK, 'Indie Rock'),
        (INDIE_POP, 'Indie Pop'),
        (ALTERNATIVE_ROCK, 'Alternative Rock'),
        (METAL, 'Metal'),
        (PUNK, 'Punk'),

        # --- Pop y derivados ---
        (POP, 'Pop'),
        (KPOP, 'K-pop'),
        (JPOP, 'J-pop'),

        # --- Jazz / Blues / Soul ---
        (JAZZ, 'Jazz'),
        (BLUES, 'Blues'),
        (DISCO, 'Disco'),

        # --- Música Latina ---
        (SALSA, 'Salsa'),
        (BACHATA, 'Bachata'),
        (REGGAETON, 'Reggaeton'),
        (CUMBIA, 'Cumbia'),
        (DEMBOW, 'Dembow'),
        (BOLERO, 'Bolero'),

        # --- Electrónica ---
        (ELECTRONICA, 'Electronica'),
        (TECHNO, 'Techno'),

        # --- Hip Hop / Reggae ---
        (HIP_HOP, 'Hip Hop'),
        (REGGAE, 'Reggae'),
        (TRAP, 'Trap'),
    ]
    
    BESTSELLER = models.BooleanField(default=False)
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    rating = models.IntegerField(default=0)
    release_date = models.DateField()
    genre = models.CharField(max_length=100, choices=GENRE_CHOICES, default=NN)
    stock = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='album_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    
    def __str__(self):
        return self.nombre

class CarritoItem(models.Model):
    session_id = models.CharField(max_length=100)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session_id', 'album']
    
    def __str__(self):
        return f"{self.cantidad}x {self.album.title}"
