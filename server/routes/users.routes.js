const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateUser } = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateUser);

// Obtener perfil del usuario autenticado
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await executeQuery(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener perfil de usuario'
    });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre es requerido'
      });
    }

    await executeQuery(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Perfil actualizado correctamente',
      data: {
        user: {
          id: userId,
          name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar perfil de usuario'
    });
  }
});

// Cambiar contraseña del usuario autenticado
router.put('/me/password', async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña actual y la nueva contraseña son requeridas'
      });
    }

    // Verificar contraseña actual
    const users = await executeQuery(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await executeQuery(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cambiar contraseña'
    });
  }
});

module.exports = router;
