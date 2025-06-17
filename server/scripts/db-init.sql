-- Script para crear e inicializar la base de datos aroma_cafe

-- Eliminar base de datos si existe para asegurar una instalación limpia
DROP DATABASE IF EXISTS aroma_cafe;

-- Crear base de datos
CREATE DATABASE aroma_cafe;

-- Usar la base de datos
USE aroma_cafe;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  image VARCHAR(255),
  capacity INT NOT NULL DEFAULT 20,
  price DECIMAL(10,2) DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de mesas
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number INT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 4,
  location VARCHAR(50),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  eventId INT NOT NULL,
  tableId INT NOT NULL,
  status ENUM('confirmed', 'canceled') DEFAULT 'confirmed',
  reservationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (eventId) REFERENCES events(id),
  FOREIGN KEY (tableId) REFERENCES tables(id),
  UNIQUE KEY unique_event_table (eventId, tableId, status)
);

-- Insertar usuario administrador
INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@aromacafe.com', '$2a$10$XGrqZ1hZg8R.bD0YSwcZ8.BaWQYXi0d5XsW2RI8cO8VFeHJ6Uc.5K', 'admin');
-- La contraseña es 'admin123' (hash bcrypt)

-- Insertar usuario de prueba
INSERT INTO users (name, email, password, role)
VALUES ('Usuario Prueba', 'usuario@test.com', '$2a$10$EJjMeLXZ/KiIV45qzEl8QuK3NmHmOqwZs.uDJC9l.11jepQJjJeZa', 'user');
-- La contraseña es 'usuario123' (hash bcrypt)

-- Insertar eventos de prueba
INSERT INTO events (title, description, date, time, image, capacity, price, isActive)
VALUES 
('Noche de Jazz', 'Disfruta de una noche con lo mejor del jazz en vivo mientras disfrutas de tu café favorito.', '2025-06-15', '19:00', './img/eventos/jazz.jpg', 20, 15.00, TRUE),
('Taller de Barismo', 'Aprende los secretos para preparar el café perfecto con nuestros expertos baristas.', '2025-06-20', '16:00', './img/eventos/barismo.jpg', 15, 25.00, TRUE),
('Cata de Café de Especialidad', 'Explora los sabores y aromas de los mejores cafés de especialidad del mundo.', '2025-06-25', '17:00', './img/eventos/cata.jpg', 12, 20.00, TRUE),
('Noche de Poesía', 'Tarde de lectura y recitales poéticos acompañados de la mejor selección de café y té.', '2025-07-05', '18:00', './img/eventos/poesia.jpg', 25, 10.00, TRUE),
('Exposición de Arte Local', 'Exhibición de obras de artistas locales mientras disfrutas de nuestras especialidades.', '2025-07-12', '11:00', './img/eventos/arte.jpg', 30, 5.00, TRUE),
('Club de Lectura', 'Únete a nuestro club mensual de lectura para discutir libros interesantes en un ambiente acogedor.', '2025-07-18', '17:00', './img/eventos/lectura.jpg', 18, 8.00, TRUE);

-- Insertar mesas
INSERT INTO tables (number, capacity, location, isActive)
VALUES 
(1, 4, 'Terraza', TRUE),
(2, 4, 'Terraza', TRUE),
(3, 6, 'Terraza', TRUE),
(4, 4, 'Terraza', TRUE),
(5, 4, 'Terraza', TRUE),
(6, 4, 'Salón Principal', TRUE),
(7, 4, 'Salón Principal', TRUE),
(8, 6, 'Salón Principal', TRUE),
(9, 4, 'Salón Principal', TRUE),
(10, 4, 'Salón Principal', TRUE),
(11, 4, 'Área Privada', TRUE),
(12, 6, 'Área Privada', TRUE),
(13, 4, 'Área Privada', TRUE),
(14, 4, 'Área Privada', TRUE),
(15, 6, 'Área Privada', TRUE);
