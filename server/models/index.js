const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// Importar modelos
const User = require('./User')(sequelize);
const Event = require('./Event')(sequelize);
const Table = require('./Table')(sequelize);
const Reservation = require('./Reservation')(sequelize);

// Definir relaciones

// Un usuario puede tener muchas reservas
User.hasMany(Reservation, { as: 'reservations', foreignKey: 'userId' });
Reservation.belongsTo(User, { as: 'user', foreignKey: 'userId' });

// Un evento puede tener muchas reservas
Event.hasMany(Reservation, { as: 'reservations', foreignKey: 'eventId' });
Reservation.belongsTo(Event, { as: 'event', foreignKey: 'eventId' });

// Una mesa puede tener muchas reservas (para diferentes eventos)
Table.hasMany(Reservation, { as: 'reservations', foreignKey: 'tableId' });
Reservation.belongsTo(Table, { as: 'table', foreignKey: 'tableId' });

// Exportar modelos y conexión
module.exports = {
  sequelize,
  User,
  Event,
  Table,
  Reservation
};
