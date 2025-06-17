const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener perfil del usuario
router.get('/me', userController.getUserProfile);

// Actualizar perfil del usuario
router.put('/me', userController.updateUserProfile);

// Cambiar contraseña
router.put('/me/password', userController.changePassword);

module.exports = router;
