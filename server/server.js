// Importaciones requeridas
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

// Rutas
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const tableRoutes = require('./routes/tableRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');
const setupRoutes = require('./routes/setupRoutes');

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definir rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/setup', setupRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({ message: 'API de Aroma Café funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3001;

// Solo autenticar y arrancar el servidor sin intentar sincronizar modelos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
    console.error('Para inicializar la base de datos manualmente, ejecute:');
    console.error('mysql -u [usuario] -p < server/scripts/db-init.sql');
  });
