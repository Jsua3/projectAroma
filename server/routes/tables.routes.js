const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Obtener todas las mesas
router.get('/', async (req, res) => {
  try {
    const tables = await executeQuery('SELECT * FROM tables ORDER BY name');

    res.status(200).json({
      status: 'success',
      results: tables.length,
      data: { tables }
    });
  } catch (error) {
    console.error('Error al obtener mesas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener mesas'
    });
  }
});

// Obtener mesas disponibles para un evento específico
router.get('/available/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const tables = await executeQuery(
      `SELECT t.* FROM tables t 
       LEFT JOIN reservations r ON t.id = r.table_id AND r.event_id = ? AND r.status = 'confirmed' 
       WHERE r.id IS NULL
       ORDER BY t.name`,
      [eventId]
    );

    res.status(200).json({
      status: 'success',
      results: tables.length,
      data: { tables }
    });
  } catch (error) {
    console.error('Error al obtener mesas disponibles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener mesas disponibles'
    });
  }
});

// Las siguientes rutas solo deberían ser accesibles por administradores en un sistema real

// Crear una nueva mesa (solo admin)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, capacity, position } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre y capacidad son requeridos'
      });
    }

    const result = await executeQuery(
      'INSERT INTO tables (name, capacity, position) VALUES (?, ?, ?)',
      [name, capacity, position || null]
    );

    const newTable = {
      id: result.insertId,
      name,
      capacity,
      position: position || null
    };

    res.status(201).json({
      status: 'success',
      message: 'Mesa creada correctamente',
      data: { table: newTable }
    });
  } catch (error) {
    console.error('Error al crear mesa:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear mesa'
    });
  }
});

module.exports = router;
