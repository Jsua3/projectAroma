const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Table = sequelize.define('Table', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        min: 1, // El número de mesa debe ser al menos 1
        notNull: {
          msg: 'El número de mesa es obligatorio'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  return Table;
};
