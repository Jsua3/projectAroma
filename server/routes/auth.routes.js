const express = require('express');
const { register, login, forgotPassword, resetPassword, verifyAuth } = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Rutas protegidas
router.get('/verify', authenticateUser, verifyAuth);

module.exports = router;
