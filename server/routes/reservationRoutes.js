const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todas las reservas del usuario
router.get('/', reservationController.getUserReservations);

// Crear una nueva reserva
router.post('/', reservationController.createReservation);

// Cancelar una reserva
router.patch('/:id/cancel', reservationController.cancelReservation);

// Obtener detalles de una reserva
router.get('/:id', reservationController.getReservationById);

module.exports = router;
