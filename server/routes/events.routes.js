const express = require('express');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/events.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Rutas protegidas (solo admin en un sistema real tendría permisos para estas operaciones)
router.post('/', authenticateUser, createEvent);
router.put('/:id', authenticateUser, updateEvent);
router.delete('/:id', authenticateUser, deleteEvent);

module.exports = router;
