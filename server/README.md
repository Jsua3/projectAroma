# Aroma Café - API REST

API REST para la aplicación web de Aroma Café, que permite gestionar usuarios, eventos, mesas y reservas.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL (mysql2)
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- nodemailer para envío de correos electrónicos

## Requisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Copiar el archivo `.env.example` a `.env` y configurar las variables de entorno:

```bash
cp .env.example .env
```

4. Configurar la base de datos:

```bash
# Crear la base de datos y las tablas
mysql -u tu_usuario -p < db/schema.sql
```

## Uso

```bash
# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm start
```

## Estructura del proyecto

```
/server
  /config          # Configuración de la aplicación
  /controllers     # Controladores para las rutas
  /db              # Scripts de base de datos
  /middleware      # Middleware personalizado
  /routes          # Definición de rutas
  /utils           # Utilidades
  .env.example     # Plantilla de variables de entorno
  index.js         # Punto de entrada
  package.json     # Dependencias y scripts
```

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/forgot-password` - Solicitar restablecimiento de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña
- `GET /api/auth/verify` - Verificar autenticación (protegida)

### Usuarios

- `GET /api/users/me` - Obtener perfil del usuario (protegida)
- `PUT /api/users/me` - Actualizar perfil del usuario (protegida)
- `PUT /api/users/me/password` - Cambiar contraseña (protegida)

### Eventos

- `GET /api/events` - Obtener todos los eventos
- `GET /api/events/:id` - Obtener un evento por ID
- `POST /api/events` - Crear un nuevo evento (protegida)
- `PUT /api/events/:id` - Actualizar un evento (protegida)
- `DELETE /api/events/:id` - Eliminar un evento (protegida)

### Mesas

- `GET /api/tables` - Obtener todas las mesas
- `GET /api/tables/available/:eventId` - Obtener mesas disponibles para un evento
- `POST /api/tables` - Crear una nueva mesa (protegida)

### Reservas

- `GET /api/reservations` - Obtener reservas del usuario (protegida)
- `GET /api/reservations/:id` - Obtener detalles de una reserva (protegida)
- `POST /api/reservations` - Crear una nueva reserva (protegida)
- `PATCH /api/reservations/:id/cancel` - Cancelar una reserva (protegida)

## Licencia

ISC
