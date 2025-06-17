const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tables',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'canceled'),
      defaultValue: 'confirmed'
    },
    reservationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      // Índice compuesto para verificar disponibilidad
      {
        unique: true,
        fields: ['eventId', 'tableId'],
        where: {
          status: 'confirmed'
        }
      }
    ]
  });

  return Reservation;
};
