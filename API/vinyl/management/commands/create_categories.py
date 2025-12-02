from django.core.management.base import BaseCommand
from vinyl.models import Categoria, Album

class Command(BaseCommand):
    help = 'Crea categorías y asigna álbumes'

    def handle(self, *args, **options):
        # Crear categorías
        categorias_data = [
            {'nombre': 'Rock & Metal', 'descripcion': 'Rock, Metal, Punk y géneros relacionados'},
            {'nombre': 'Pop Internacional', 'descripcion': 'Pop, K-pop, J-pop'},
            {'nombre': 'Jazz & Blues', 'descripcion': 'Jazz, Blues y música clásica'},
            {'nombre': 'Música Latina', 'descripcion': 'Salsa, Bachata, Reggaeton, Cumbia'},
            {'nombre': 'Electrónica', 'descripcion': 'Disco, Electronica, Techno'},
            {'nombre': 'Hip Hop & Reggae', 'descripcion': 'Hip Hop, Reggae, Trap'},
        ]
        
        created_categories = 0
        for cat_data in categorias_data:
            categoria, created = Categoria.objects.get_or_create(
                nombre=cat_data['nombre'],
                defaults={'descripcion': cat_data['descripcion']}
            )
            if created:
                created_categories += 1
                self.stdout.write(f"[+] Categoria creada: {categoria.nombre}")
        
        # Asignar álbumes a categorías
        asignaciones = {
            'Rock & Metal': ['Rock', 'Indie Rock', 'Alternative Rock', 'Metal', 'Punk'],
            'Pop Internacional': ['Pop', 'K-pop', 'J-pop', 'Indie Pop'],
            'Jazz & Blues': ['Jazz', 'Blues'],
            'Música Latina': ['Salsa', 'Bachata', 'Reggaeton', 'Cumbia', 'Dembow', 'Bolero'],
            'Electrónica': ['Disco', 'Electronica', 'Techno'],
            'Hip Hop & Reggae': ['Hip Hop', 'Reggae', 'Trap'],
        }
        
        albums_assigned = 0
        for categoria_nombre, generos in asignaciones.items():
            try:
                categoria = Categoria.objects.get(nombre=categoria_nombre)
                albums = Album.objects.filter(genre__in=generos, categoria__isnull=True)
                
                for album in albums:
                    album.categoria = categoria
                    album.save()
                    albums_assigned += 1
                    self.stdout.write(f"[*] {album.title} -> {categoria_nombre}")
                    
            except Categoria.DoesNotExist:
                self.stdout.write(f"Error: Categoria {categoria_nombre} no encontrada")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nProceso completado:\n'
                f'   - {created_categories} categorias creadas\n'
                f'   - {albums_assigned} albumes asignados a categorias'
            )
        )