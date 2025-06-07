const { executeQuery } = require('../config/database');

// Obtener todas las reservas del usuario autenticado
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await executeQuery(
      `SELECT r.*, 
        e.title as event_title, e.description as event_description, 
        e.image_url as event_image, e.date as event_date, e.time as event_time,
        t.name as table_name, t.capacity as table_capacity
      FROM reservations r
      JOIN events e ON r.event_id = e.id
      JOIN tables t ON r.table_id = t.id
      WHERE r.user_id = ?
      ORDER BY e.date DESC, e.time DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations
      }
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener reservas'
    });
  }
};

// Crear una nueva reserva
const createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, tableId } = req.body;

    // Validar datos requeridos
    if (!eventId || !tableId) {
      return res.status(400).json({
        status: 'error',
        message: 'ID del evento y de la mesa son requeridos'
      });
    }

    // Verificar si el evento existe y está activo
    const events = await executeQuery(
      'SELECT id FROM events WHERE id = ? AND is_active = TRUE AND date >= CURDATE()',
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Evento no encontrado o no disponible'
      });
    }

    // Verificar si la mesa existe
    const tables = await executeQuery(
      'SELECT id FROM tables WHERE id = ?',
      [tableId]
    );

    if (tables.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Mesa no encontrada'
      });
    }

    // Verificar si la mesa ya está reservada para este evento
    const existingReservations = await executeQuery(
      "SELECT id FROM reservations WHERE event_id = ? AND table_id = ? AND status = 'confirmed'",
      [eventId, tableId]
    );

    if (existingReservations.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Esta mesa ya está reservada para este evento'
      });
    }

    // Crear la reserva
    const result = await executeQuery(
      'INSERT INTO reservations (user_id, event_id, table_id) VALUES (?, ?, ?)',
      [userId, eventId, tableId]
    );

    // Obtener los detalles de la reserva recién creada
    const newReservation = await executeQuery(
      `SELECT r.*, 
        e.title as event_title, e.description as event_description, 
        e.image_url as event_image, e.date as event_date, e.time as event_time,
        t.name as table_name, t.capacity as table_capacity
      FROM reservations r
      JOIN events e ON r.event_id = e.id
      JOIN tables t ON r.table_id = t.id
      WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Reserva creada correctamente',
      data: {
        reservation: newReservation[0]
      }
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);

    // Verificar si es un error de duplicado (mesa ya reservada)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Esta mesa ya está reservada para este evento'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error al crear reserva'
    });
  }
};

// Cancelar una reserva
const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar si la reserva existe y pertenece al usuario
    const reservations = await executeQuery(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada o no tienes permiso para cancelarla'
      });
    }

    // Verificar si el evento ya pasó
    const eventInfo = await executeQuery(
      'SELECT e.date, e.time FROM reservations r JOIN events e ON r.event_id = e.id WHERE r.id = ?',
      [id]
    );

    const eventDate = new Date(`${eventInfo[0].date}T${eventInfo[0].time}`);
    const now = new Date();

    if (eventDate < now) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede cancelar una reserva para un evento que ya ha pasado'
      });
    }

    // Actualizar estado de la reserva a 'canceled'
    await executeQuery(
      "UPDATE reservations SET status = 'canceled' WHERE id = ?",
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Reserva cancelada correctamente'
    });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cancelar reserva'
    });
  }
};

// Obtener detalles de una reserva específica
const getReservationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservations = await executeQuery(
      `SELECT r.*, 
        e.title as event_title, e.description as event_description, 
        e.image_url as event_image, e.date as event_date, e.time as event_time,
        t.name as table_name, t.capacity as table_capacity
      FROM reservations r
      JOIN events e ON r.event_id = e.id
      JOIN tables t ON r.table_id = t.id
      WHERE r.id = ? AND r.user_id = ?`,
      [id, userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada o no tienes permiso para verla'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        reservation: reservations[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener reserva'
    });
  }
};

module.exports = {
  getUserReservations,
  createReservation,
  cancelReservation,
  getReservationById
};
