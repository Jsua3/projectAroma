const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', tableController.getAllTables);
router.get('/available/:eventId', tableController.getAvailableTables);

// Rutas protegidas (solo admin)
router.post('/', authenticate, authorize('admin'), tableController.createTable);
router.put('/:id', authenticate, authorize('admin'), tableController.updateTable);
router.delete('/:id', authenticate, authorize('admin'), tableController.deleteTable);

module.exports = router;
