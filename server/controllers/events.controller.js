const { executeQuery } = require('../config/database');

// Obtener todos los eventos
const getAllEvents = async (req, res) => {
  try {
    // Filtros opcionales por fecha
    const { upcoming, past, date } = req.query;

    let sql = 'SELECT * FROM events';
    const params = [];

    // Aplicar filtros si existen
    if (upcoming === 'true') {
      sql += ' WHERE date >= CURDATE()';
    } else if (past === 'true') {
      sql += ' WHERE date < CURDATE()';
    } else if (date) {
      sql += ' WHERE date = ?';
      params.push(date);
    }

    // Ordenar por fecha ascendente
    sql += ' ORDER BY date ASC, time ASC';

    const events = await executeQuery(sql, params);

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener eventos'
    });
  }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await executeQuery(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Evento no encontrado'
      });
    }

    // Obtener las mesas disponibles para este evento
    const tables = await executeQuery(
      `SELECT t.* FROM tables t 
       LEFT JOIN reservations r ON t.id = r.table_id AND r.event_id = ? AND r.status = 'confirmed' 
       WHERE r.id IS NULL`,
      [id]
    );

    // Obtener las mesas ocupadas
    const reservedTables = await executeQuery(
      `SELECT t.* FROM tables t 
       JOIN reservations r ON t.id = r.table_id 
       WHERE r.event_id = ? AND r.status = 'confirmed'`,
      [id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        event: events[0],
        availableTables: tables,
        reservedTables: reservedTables
      }
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener evento'
    });
  }
};

// Crear un nuevo evento (solo admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, image_url, date, time, duration, capacity } = req.body;

    // Validar datos requeridos
    if (!title || !description || !date || !time) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos título, descripción, fecha y hora son requeridos'
      });
    }

    // Insertar evento
    const result = await executeQuery(
      'INSERT INTO events (title, description, image_url, date, time, duration, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, date, time, duration || 120, capacity || 50]
    );

    const newEvent = {
      id: result.insertId,
      title,
      description,
      image_url,
      date,
      time,
      duration: duration || 120,
      capacity: capacity || 50,
      is_active: true
    };

    res.status(201).json({
      status: 'success',
      message: 'Evento creado correctamente',
      data: {
        event: newEvent
      }
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear evento'
    });
  }
};

// Actualizar un evento (solo admin)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, date, time, duration, capacity, is_active } = req.body;

    // Verificar si el evento existe
    const events = await executeQuery(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Evento no encontrado'
      });
    }

    // Preparar los campos a actualizar
    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
    }

    if (description) {
      updates.push('description = ?');
      params.push(description);
    }

    if (image_url !== undefined) {
      updates.push('image_url = ?');
      params.push(image_url);
    }

    if (date) {
      updates.push('date = ?');
      params.push(date);
    }

    if (time) {
      updates.push('time = ?');
      params.push(time);
    }

    if (duration) {
      updates.push('duration = ?');
      params.push(duration);
    }

    if (capacity) {
      updates.push('capacity = ?');
      params.push(capacity);
    }

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No se proporcionaron datos para actualizar'
      });
    }

    // Añadir el ID al final de los parámetros
    params.push(id);

    // Ejecutar la actualización
    await executeQuery(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Obtener el evento actualizado
    const updatedEvents = await executeQuery(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Evento actualizado correctamente',
      data: {
        event: updatedEvents[0]
      }
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar evento'
    });
  }
};

// Eliminar un evento (solo admin)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el evento existe
    const events = await executeQuery(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Evento no encontrado'
      });
    }

    // Eliminar evento (las reservas asociadas se eliminarán automáticamente por la restricción ON DELETE CASCADE)
    await executeQuery(
      'DELETE FROM events WHERE id = ?',
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Evento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar evento'
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
