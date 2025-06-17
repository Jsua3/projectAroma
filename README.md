 # Aroma Café - Sitio Web
# Aroma Café - Sistema de Reservas

Este proyecto implementa un sistema completo para la cafetería Aroma Café, permitiendo a los usuarios registrarse, iniciar sesión, ver eventos, seleccionar mesas y realizar reservas.

## Estructura del Proyecto

- **Frontend**: Interfaz de usuario en HTML, CSS y JavaScript
- **Backend**: API REST en Node.js con Express y MySQL

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- SweetAlert2 para notificaciones

### Backend
- Node.js
- Express
- MySQL
- Sequelize (ORM)
- JWT para autenticación

## Instalación y Configuración

### Requisitos Previos

- Node.js (v14+)
- MySQL (v5.7+)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd aroma-cafe
```

2. **Configurar la Base de Datos**

- Crear una base de datos MySQL llamada `aroma_cafe`
- Ejecutar el script SQL de inicialización:

```bash
mysql -u tu_usuario -p aroma_cafe < server/scripts/db-init.sql
```

3. **Configurar el Backend**

```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server` con el siguiente contenido (modifica según tu configuración):

```
PORT=3001
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=aroma_cafe
DB_PORT=3306
JWT_SECRET=aroma_cafe_secret_key
JWT_EXPIRES_IN=7d
```

4. **Iniciar el Servidor**

```bash
cd server
npm start
```

5. **Iniciar el Frontend**

El frontend es estático, así que puedes usar cualquier servidor web. Para desarrollo, puedes usar la extensión Live Server de VSCode o simplemente abrir los archivos HTML en tu navegador.

## Características

- **Registro e inicio de sesión de usuarios**
- **Visualización de eventos de la cafetería**
- **Selección de mesas para eventos**
- **Reservas de mesas para eventos**
- **Gestión de perfil de usuario**
- **Cancelación de reservas**

## Roles de Usuario

- **Usuario Regular**: Puede ver eventos, hacer reservas y gestionar su perfil
- **Administrador**: Puede gestionar eventos, mesas y ver todas las reservas

## Endpoints de la API

Consulta el archivo README.md en la carpeta `server` para ver la documentación completa de la API.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
Este proyecto es un sitio web para la cafetería "Aroma Café", desarrollado con HTML, CSS y JavaScript. El sitio permite a los usuarios ver información sobre la cafetería, su menú, eventos, y reservar mesas para eventos específicos.

## Características

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios
- **Página de Eventos**: Muestra eventos próximos con opción de reserva
- **Sistema de Reserva de Mesas**: Permite seleccionar mesas específicas para eventos
- **Perfil de Usuario**: Muestra las reservas del usuario y permite cancelarlas
- **Menú de Productos**: Exhibe las bebidas y alimentos disponibles

## Estructura del Proyecto

```
/
├── index.html            # Página principal
├── menu.html             # Página de menú de productos
├── eventos.html          # Página de eventos
├── seleccion-mesa.html   # Página para seleccionar mesa
├── perfil.html           # Página de perfil de usuario
├── login.html            # Página de inicio de sesión
├── registro.html         # Página de registro de usuarios
├── nosotros.html         # Página sobre la cafetería
├── contacto.html         # Página de contacto
├── css/
│   └── styles.css        # Estilos generales
├── js/
│   ├── auth.js           # Funciones de autenticación
│   ├── login.js          # Lógica de inicio de sesión
│   ├── registro.js       # Lógica de registro
│   ├── eventos.js        # Gestión de eventos
│   ├── seleccion-mesa.js # Selección de mesas
│   ├── perfil.js         # Gestión de perfil
│   ├── contacto.js       # Formulario de contacto
│   └── main.js           # Funciones generales
└── img/                  # Imágenes del sitio
```

## Almacenamiento de Datos

Para este proyecto de demostración, se utiliza `localStorage` para almacenar datos de:

- Usuarios registrados
- Eventos disponibles
- Mesas disponibles
- Reservas realizadas

En un entorno de producción, estos datos deberían almacenarse en una base de datos en el servidor.

## Cómo Usar

1. Abre `index.html` en tu navegador para acceder a la página principal
2. Regístrate con un correo electrónico y contraseña
3. Explora los eventos disponibles y haz clic en "Me interesa" para reservar
4. Selecciona una mesa disponible para el evento
5. En tu perfil podrás ver tus reservas y cancelarlas si lo deseas

## Usuario de Prueba

El sistema incluye un usuario de demostración precargado:

- **Email**: demo@example.com
- **Contraseña**: demo123

## Mejoras Futuras

- Implementar backend real con base de datos
- Agregar sistema de pago para eventos premium
- Implementar notificaciones por email
- Agregar sistema de comentarios y valoraciones

## Licencia

Este proyecto es solo para fines educativos y de demostración.
