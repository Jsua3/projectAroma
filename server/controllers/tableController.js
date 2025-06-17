const { Table, Reservation } = require('../models');

// Obtener todas las mesas
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.findAll({
      where: { isActive: true },
      order: [['number', 'ASC']]
    });

    res.json({
      success: true,
      data: { tables }
    });
  } catch (error) {
    console.error('Error al obtener mesas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener mesas', 
      error: error.message 
    });
  }
};

// Obtener mesas disponibles para un evento
exports.getAvailableTables = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Obtener mesas ya reservadas para este evento
    const reservedTables = await Reservation.findAll({
      where: {
        eventId,
        status: 'confirmed'
      },
      attributes: ['tableId']
    });

    const reservedTableIds = reservedTables.map(reservation => reservation.tableId);

    // Obtener todas las mesas activas
    const allTables = await Table.findAll({
      where: { isActive: true },
      order: [['number', 'ASC']]
    });

    // Filtrar las mesas disponibles
    const availableTables = allTables.map(table => ({
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      location: table.location,
      isAvailable: !reservedTableIds.includes(table.id)
    }));

    res.json({
      success: true,
      data: { tables: availableTables }
    });
  } catch (error) {
    console.error('Error al obtener mesas disponibles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener mesas disponibles', 
      error: error.message 
    });
  }
};

// Crear mesa (solo admin)
exports.createTable = async (req, res) => {
  try {
    const { number, capacity, location } = req.body;

    // Verificar si ya existe una mesa con ese número
    const existingTable = await Table.findOne({ where: { number } });
    if (existingTable) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe una mesa con ese número' 
      });
    }

    const table = await Table.create({
      number,
      capacity,
      location
    });

    res.status(201).json({
      success: true,
      data: { table }
    });
  } catch (error) {
    console.error('Error al crear mesa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear mesa', 
      error: error.message 
    });
  }
};

// Actualizar mesa (solo admin)
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, capacity, location, isActive } = req.body;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mesa no encontrada' 
      });
    }

    // Si se está cambiando el número, verificar que no exista otra mesa con ese número
    if (number !== table.number) {
      const existingTable = await Table.findOne({ where: { number } });
      if (existingTable) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe una mesa con ese número' 
        });
      }
    }

    await table.update({
      number,
      capacity,
      location,
      isActive
    });

    res.json({
      success: true,
      data: { table }
    });
  } catch (error) {
    console.error('Error al actualizar mesa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar mesa', 
      error: error.message 
    });
  }
};

// Eliminar mesa (solo admin)
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mesa no encontrada' 
      });
    }

    // Verificar si hay reservas para esta mesa
    const reservations = await Reservation.findAll({
      where: { tableId: id }
    });

    if (reservations.length > 0) {
      // Si hay reservas, simplemente marcar como inactiva
      await table.update({ isActive: false });
      return res.json({
        success: true,
        data: { message: 'Mesa desactivada debido a reservas existentes' }
      });
    }

    // Si no hay reservas, eliminar completamente
    await table.destroy();

    res.json({
      success: true,
      data: { message: 'Mesa eliminada correctamente' }
    });
  } catch (error) {
    console.error('Error al eliminar mesa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar mesa', 
      error: error.message 
    });
  }
};
