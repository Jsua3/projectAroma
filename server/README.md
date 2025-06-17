# API REST para Aroma Café
# API de Aroma Café
# API de Aroma Café

## Configuración Inicial

### Requisitos
- Node.js (v14 o superior)
- MySQL

### Instalación

1. Instalar dependencias:
   ```
   cd server
   npm install
   ```

2. Configurar variables de entorno en un archivo `.env`:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=aroma_cafe
   JWT_SECRET=tu_clave_secreta
   ```

3. Inicializar la base de datos:
   ```
   npm run force-reset-db
   ```
   Este comando:
   - Elimina la base de datos si existe
   - Crea una nueva base de datos
   - Crea las tablas necesarias
   - Agrega usuarios iniciales

### Usuarios predeterminados

- **Administrador**:
  - Email: admin@aromacafe.com
  - Contraseña: admin123

- **Usuario de prueba**:
  - Email: usuario@test.com
  - Contraseña: usuario123

## Ejecución

```
npm start
```

Para desarrollo con recarga automática:
```
npm run dev
```

## Eventos y Mesas

La aplicación ahora utiliza un enfoque dinámico para la inicialización de datos:

1. Los usuarios iniciales se crean automáticamente con los scripts de inicialización.
2. Los eventos y mesas se crean dinámicamente a través de la interfaz web por el administrador.

## Scripts disponibles

- `npm start`: Inicia el servidor
- `npm run dev`: Inicia el servidor con recarga automática (nodemon)
- `npm run init-db`: Inicializa solo las tablas y usuarios básicos
- `npm run reset-db`: Reinicia la base de datos manteniendo la base de datos existente
- `npm run force-reset-db`: Elimina y recrea la base de datos completa

## Solución de problemas

Si encuentras errores al iniciar el servidor:

1. Verifica que MySQL esté ejecutándose
2. Comprueba que las credenciales en el archivo `.env` sean correctas
3. Asegúrate de haber creado correctamente la base de datos con `npm run force-reset-db`
4. Si aparece un error de clave duplicada, ejecuta `npm run force-reset-db` para limpiar completamente la base de datos
## Requisitos previos
- Node.js (v14 o superior)
- MySQL

## Configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. Crear base de datos MySQL llamada `aroma_cafe`

3. Configurar variables de entorno en el archivo `.env`:
   - PORT: Puerto para el servidor (por defecto 3001)
   - DB_HOST: Host de la base de datos (por defecto localhost)
   - DB_USER: Usuario de MySQL
   - DB_PASSWORD: Contraseña de MySQL
   - DB_NAME: Nombre de la base de datos (aroma_cafe)
   - JWT_SECRET: Clave secreta para JWT

## Ejecución

```
npm start
```

Para desarrollo con recarga automática:
```
npm run dev
```

## Solución de problemas

Si tienes problemas al iniciar el servidor:

1. Verifica que MySQL esté ejecutándose
2. Confirma que las credenciales en `.env` sean correctas
3. Asegúrate de haber creado la base de datos `aroma_cafe`
Este proyecto implementa una API REST para la cafetería Aroma Café, permitiendo a los usuarios registrarse, iniciar sesión, ver eventos, seleccionar mesas y realizar reservas.

## Requisitos

- Node.js (v14+)
- MySQL

## Instalación
# API de Aroma Café

## Configuración Inicial

### Requisitos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)

### Instalación

1. Instalar dependencias:
   ```
   cd server
   npm install
   ```

2. Configurar variables de entorno en un archivo `.env`:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=aroma_cafe
   JWT_SECRET=tu_clave_secreta
   ```

3. Inicializar la base de datos:

   - En Windows:
     ```
     npm run init-db-win
     ```

   - En Linux/Mac:
     ```
     npm run init-db-unix
     ```

   Alternativamente, puedes ejecutar directamente el script SQL:
   ```
   mysql -u [usuario] -p < scripts/db-init.sql
   ```

### Usuarios predeterminados

- **Administrador**:
  - Email: admin@aromacafe.com
  - Contraseña: admin123

- **Usuario de prueba**:
  - Email: usuario@test.com
  - Contraseña: usuario123

## Ejecución

```
npm start
```

Para desarrollo con recarga automática:
```
npm run dev
```

## Solución de problemas

Si encuentras errores al iniciar el servidor, especialmente errores relacionados con "duplicate entry" o "unique constraint":

1. Asegúrate de haber inicializado correctamente la base de datos con los scripts proporcionados
2. Verifica que MySQL esté ejecutándose
3. Comprueba que las credenciales en el archivo `.env` sean correctas

### Error: "Duplicate entry '0' for key 'number'"

Este error indica que hay un problema con la estructura de la base de datos. La solución más efectiva es:

1. Eliminar completamente la base de datos y recrearla con el script SQL:
   ```
   mysql -u [usuario] -p < scripts/db-init.sql
   ```

2. Si el problema persiste, verifica manualmente que no haya registros problemáticos:
   ```sql
   USE aroma_cafe;
   SELECT * FROM tables WHERE number = 0;
   -- Si encuentras registros, elimínalos:
   DELETE FROM tables WHERE number = 0;
   ```
1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Configurar variables de entorno:
   - Renombrar `.env.example` a `.env`
   - Ajustar los valores según tu configuración local

4. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE aroma_cafe;
   ```
# API de Aroma Café

## Requisitos previos
- Node.js (v14 o superior)
- MySQL

## Configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. Crear base de datos MySQL llamada `aroma_cafe`

3. Configurar variables de entorno en el archivo `.env`:
   - PORT: Puerto para el servidor (por defecto 3001)
   - DB_HOST: Host de la base de datos (por defecto localhost)
   - DB_USER: Usuario de MySQL
   - DB_PASSWORD: Contraseña de MySQL
   - DB_NAME: Nombre de la base de datos (aroma_cafe)
   - JWT_SECRET: Clave secreta para JWT

## Ejecución

```
npm start
```

Para desarrollo con recarga automática:
```
npm run dev
```

## Solución de problemas

Si encuentras el error `Duplicate entry '0' for key 'number'` al iniciar el servidor:

1. Reinicia completamente la base de datos ejecutando:
   ```
   npm run reset-db
   ```
   Esto eliminará todas las tablas y las recreará con datos de prueba.

2. Si el problema persiste, verifica manualmente tu base de datos MySQL para asegurarte de que no haya entradas con número de mesa '0'.

3. Asegúrate de que MySQL esté configurado correctamente en tu archivo `.env`.
5. Inicializar la base de datos con datos de prueba (opcional):
   ```
   node utils/dbInitializer.js
   ```

## Ejecución

```
npm start
```

Para desarrollo (con recarga automática):
```
npm run dev
```

## Estructura del Proyecto
# API de Aroma Café
# API Aroma Café

## Inicialización de la Base de Datos

La aplicación ahora utiliza un enfoque dinámico para la inicialización de datos:

1. Al reiniciar la base de datos, solo se crean los usuarios iniciales (admin y usuario de prueba).
2. Los eventos y mesas se crean dinámicamente a través de la interfaz web por el administrador.

### Usuarios iniciales

- **Administrador**:
  - Email: admin@aromacafe.com
  - Contraseña: admin123

- **Usuario de prueba**:
  - Email: usuario@test.com
  - Contraseña: usuario123

## Endpoints para configuración inicial

- `GET /api/setup/status`: Verifica si ya existen eventos y mesas en la base de datos
- `POST /api/setup/events`: Crea eventos iniciales (solo admin)
- `POST /api/setup/tables`: Crea mesas iniciales (solo admin)

## Solución de problemas

Si encuentras el error "Duplicate entry '0' for key 'number'" al iniciar el servidor:

1. Reinicia completamente la base de datos:
   ```
   npm run force-reset-db
   ```

2. Inicia el servidor:
   ```
   npm start
   ```

3. Accede como administrador y utiliza la interfaz para crear eventos y mesas.
## Requisitos previos
- Node.js (v14 o superior)
- MySQL

## Configuración inicial

1. Instalar dependencias:
   ```
   cd server
   npm install
   ```

2. Configurar variables de entorno en el archivo `.env`:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=aroma_cafe
   JWT_SECRET=tu_clave_secreta
   ```

3. Inicializar la base de datos:
   ```
   npm run force-reset-db
   ```

## Ejecución

```
npm start
```

Para desarrollo con recarga automática:
```
npm run dev
```

## Solución de problemas

### Error: "Duplicate entry '0' for key 'number'"

Este error ocurre cuando hay un conflicto con los números de mesa en la base de datos. Para solucionarlo:

1. Ejecuta el reinicio forzado de la base de datos:
   ```
   npm run force-reset-db
   ```
   Este comando eliminará completamente la base de datos y la recreará desde cero.

2. Si el problema persiste después del reinicio forzado:
   - Verifica que no haya otros procesos intentando modificar la base de datos
   - Asegúrate de que las credenciales en el archivo `.env` sean correctas
   - Confirma que tengas los permisos adecuados para crear/eliminar bases de datos en MySQL

### Error de conexión a la base de datos

Si tienes problemas para conectarte a la base de datos:

1. Verifica que MySQL esté funcionando:
   ```
   sudo service mysql status  # Linux
   # o
   net start mysql            # Windows
   ```

2. Confirma tus credenciales usando el cliente MySQL:
   ```
   mysql -u root -p
   ```

3. Asegúrate de que la base de datos exista:
   ```
   SHOW DATABASES;  # Desde el cliente MySQL
   ```

## Estructura del proyecto

- `controllers/`: Lógica de negocio para cada entidad
- `models/`: Definición de modelos Sequelize
- `routes/`: Definición de rutas API
- `middleware/`: Middleware para autenticación y autorización
- `scripts/`: Scripts de utilidad (inicialización de DB, etc.)
- `utils/`: Funciones de utilidad
- `/config` - Configuración de la base de datos
- `/controllers` - Controladores para cada entidad
- `/middleware` - Middlewares para autenticación y autorización
- `/models` - Modelos de datos (Sequelize)
- `/routes` - Rutas de la API
- `/utils` - Utilidades

## Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar autenticación

### Eventos
- `GET /api/events` - Obtener todos los eventos
- `GET /api/events/:id` - Obtener un evento por ID
- `POST /api/events` - Crear un evento (admin)
- `PUT /api/events/:id` - Actualizar un evento (admin)
- `DELETE /api/events/:id` - Eliminar un evento (admin)

### Mesas
- `GET /api/tables` - Obtener todas las mesas
- `GET /api/tables/available/:eventId` - Obtener mesas disponibles para un evento
- `POST /api/tables` - Crear una mesa (admin)
- `PUT /api/tables/:id` - Actualizar una mesa (admin)
- `DELETE /api/tables/:id` - Eliminar una mesa (admin)

### Reservas
- `GET /api/reservations` - Obtener reservas del usuario
- `POST /api/reservations` - Crear una reserva
- `PATCH /api/reservations/:id/cancel` - Cancelar una reserva
- `GET /api/reservations/:id` - Obtener detalles de una reserva

### Usuarios
- `GET /api/users/me` - Obtener perfil del usuario
- `PUT /api/users/me` - Actualizar perfil del usuario
- `PUT /api/users/me/password` - Cambiar contraseña
