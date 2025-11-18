# EcommerceEmp - Tienda de Música

Aplicación de ecommerce desarrollada con Django REST Framework y React que permite gestionar inventarios de álbumes musicales.

## Características

- **API REST** con Django para gestión de productos
- **Frontend React** con navegación entre vistas
- **Gestión de carrito** de compras
- **Interfaz responsiva** y moderna

## Vistas Implementadas

1. **Home** - Lista todos los productos disponibles
2. **Detalle Producto** - Información completa del producto seleccionado
3. **Carrito** - Gestión de productos agregados (sin checkout)

## Instalación

### Backend (Django)
```bash
# Crear ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install django djangorestframework django-cors-headers

# Ejecutar migraciones
cd API
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Uso

1. Ejecutar el backend en `http://localhost:8000`
2. Ejecutar el frontend en `http://localhost:3000`
3. La aplicación se conecta automáticamente a la API

## Estructura

- `API/` - Backend Django con modelos y API REST
- `frontend/` - Aplicación React con componentes de UI
- `frontend/src/components/` - Componentes principales (Home, DetalleProducto, Carrito)