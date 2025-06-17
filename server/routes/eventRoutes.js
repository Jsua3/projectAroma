const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Rutas públicas
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

module.exports = router;
