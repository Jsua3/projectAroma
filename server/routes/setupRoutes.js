const express = require('express');
const router = express.Router();
const { sequelize, User, Event, Table } = require('../models');
const bcrypt = require('bcryptjs');

// GET /api/setup/init — inicializa tablas y datos de prueba (usar solo una vez)
router.get('/init', async (req, res) => {
  try {
    // Crear tablas si no existen
    await sequelize.sync({ force: false });

    // Verificar si ya hay datos
    const userCount = await User.count();
    if (userCount > 0) {
      return res.json({ message: 'La base de datos ya está inicializada.', status: 'already_done' });
    }

    // Crear usuarios de prueba
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('usuario123', 10);

    await User.bulkCreate([
      { name: 'Administrador', email: 'admin@aromacafe.com', password: adminPassword, role: 'admin' },
      { name: 'Usuario Prueba', email: 'usuario@test.com', password: userPassword, role: 'user' }
    ]);

    // Crear eventos
    await Event.bulkCreate([
      { title: 'Noche de Jazz', description: 'Disfruta de una noche con lo mejor del jazz en vivo mientras disfrutas de tu café favorito.', date: '2026-06-15', time: '19:00', image: './img/eventos/jazz.jpg', capacity: 20, price: 15.00, isActive: true },
      { title: 'Taller de Barismo', description: 'Aprende los secretos para preparar el café perfecto con nuestros expertos baristas.', date: '2026-06-20', time: '16:00', image: './img/eventos/barismo.jpg', capacity: 15, price: 25.00, isActive: true },
      { title: 'Cata de Café de Especialidad', description: 'Explora los sabores y aromas de los mejores cafés de especialidad del mundo.', date: '2026-06-25', time: '17:00', image: './img/eventos/cata.jpg', capacity: 12, price: 20.00, isActive: true },
      { title: 'Noche de Poesía', description: 'Tarde de lectura y recitales poéticos acompañados de la mejor selección de café y té.', date: '2026-07-05', time: '18:00', image: './img/eventos/poesia.jpg', capacity: 25, price: 10.00, isActive: true },
      { title: 'Exposición de Arte Local', description: 'Exhibición de obras de artistas locales mientras disfrutas de nuestras especialidades.', date: '2026-07-12', time: '11:00', image: './img/eventos/arte.jpg', capacity: 30, price: 5.00, isActive: true },
      { title: 'Club de Lectura', description: 'Únete a nuestro club mensual de lectura para discutir libros interesantes en un ambiente acogedor.', date: '2026-07-18', time: '17:00', image: './img/eventos/lectura.jpg', capacity: 18, price: 8.00, isActive: true }
    ]);

    // Crear mesas
    const mesas = [];
    const terraza = [1,2,4,5];
    const salon = [6,7,9,10];
    const privada = [11,13,14];
    const grandes = [3,8,12,15];

    for (let i = 1; i <= 15; i++) {
      let location = 'Área Privada';
      let capacity = 4;
      if (terraza.includes(i)) location = 'Terraza';
      else if (salon.includes(i)) location = 'Salón Principal';
      if (grandes.includes(i)) capacity = 6;
      mesas.push({ number: i, capacity, location, isActive: true });
    }
    await Table.bulkCreate(mesas);

    res.json({ message: '¡Base de datos inicializada correctamente!', status: 'success', datos: { usuarios: 2, eventos: 6, mesas: 15 } });

  } catch (error) {
    res.status(500).json({ message: 'Error al inicializar', error: error.message });
  }
});

module.exports = router;
