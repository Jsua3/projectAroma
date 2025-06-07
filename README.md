 # Aroma Café - Sitio Web

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
