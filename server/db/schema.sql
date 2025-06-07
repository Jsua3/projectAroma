-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS aroma_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE aroma_cafe;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INT DEFAULT 120, -- Duración en minutos
  capacity INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de mesas
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL DEFAULT 4,
  position VARCHAR(50) DEFAULT NULL, -- Posición en el layout (e.g., 'A1', 'B2')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  table_id INT NOT NULL,
  status ENUM('confirmed', 'canceled', 'pending') DEFAULT 'confirmed',
  reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
  UNIQUE KEY unique_reservation (event_id, table_id) -- Una mesa solo puede ser reservada una vez por evento
) ENGINE=InnoDB;

-- Insertar algunas mesas predeterminadas
INSERT INTO tables (name, capacity, position) VALUES
('Mesa 1', 4, 'A1'),
('Mesa 2', 4, 'A2'),
('Mesa 3', 4, 'A3'),
('Mesa 4', 4, 'A4'),
('Mesa 5', 6, 'B1'),
('Mesa 6', 6, 'B2'),
('Mesa 7', 2, 'C1'),
('Mesa 8', 2, 'C2'),
('Mesa 9', 8, 'D1'),
('Mesa 10', 4, 'D2');
