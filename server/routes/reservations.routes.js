const express = require('express');
const { getUserReservations, createReservation, cancelReservation, getReservationById } = require('../controllers/reservations.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateUser);

router.get('/', getUserReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;
