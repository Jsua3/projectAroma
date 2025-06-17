const { Reservation, Event, Table, User } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las reservas del usuario autenticado
exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['title', 'description', 'date', 'time', 'image']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['number', 'capacity', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transformar datos para respuesta API
    const formattedReservations = reservations.map(reservation => ({
      id: reservation.id,
      status: reservation.status,
      reservationDate: reservation.reservationDate,
      event_id: reservation.eventId,
      event_title: reservation.event.title,
      event_description: reservation.event.description,
      event_date: reservation.event.date,
      event_time: reservation.event.time,
      event_image: reservation.event.image,
      table_id: reservation.tableId,
      table_number: reservation.table.number,
      table_capacity: reservation.table.capacity,
      table_location: reservation.table.location
    }));

    res.json({
      success: true,
      data: { reservations: formattedReservations }
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener reservas', 
      error: error.message 
    });
  }
};

// Crear una nueva reserva
exports.createReservation = async (req, res) => {
  try {
    const { eventId, tableId } = req.body;
    const userId = req.user.id;

    // Verificar si el evento existe
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Evento no encontrado' 
      });
    }

    // Verificar si la mesa existe
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mesa no encontrada' 
      });
    }

    // Verificar si la mesa ya está reservada para este evento
    const existingReservation = await Reservation.findOne({
      where: {
        eventId,
        tableId,
        status: 'confirmed'
      }
    });

    if (existingReservation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta mesa ya está reservada para este evento' 
      });
    }

    // Verificar si el usuario ya tiene una reserva para este evento
    const userReservation = await Reservation.findOne({
      where: {
        eventId,
        userId,
        status: 'confirmed'
      }
    });

    if (userReservation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya tienes una reserva para este evento' 
      });
    }

    // Crear la reserva
    const reservation = await Reservation.create({
      userId,
      eventId,
      tableId,
      status: 'confirmed',
      reservationDate: new Date()
    });

    res.status(201).json({
      success: true,
      data: { reservation }
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear reserva', 
      error: error.message 
    });
  }
};

// Cancelar una reserva
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId
      },
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reserva no encontrada' 
      });
    }

    // Verificar si el evento ya pasó
    const eventDate = new Date(reservation.event.date);
    if (eventDate < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes cancelar una reserva para un evento que ya pasó' 
      });
    }

    // Actualizar estado de la reserva
    await reservation.update({ status: 'canceled' });

    res.json({
      success: true,
      data: { message: 'Reserva cancelada correctamente' }
    });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cancelar reserva', 
      error: error.message 
    });
  }
};

// Obtener detalles de una reserva
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId
      },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['title', 'description', 'date', 'time', 'image']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['number', 'capacity', 'location']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reserva no encontrada' 
      });
    }

    res.json({
      success: true,
      data: { reservation }
    });
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener reserva', 
      error: error.message 
    });
  }
};
