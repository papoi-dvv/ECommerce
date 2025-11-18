# vinyl/models.py
from django.db import models
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

    def __str__(self):
        return f"{self.title} by {self.artist}"