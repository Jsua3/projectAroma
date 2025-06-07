const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Middleware para proteger rutas que requieren autenticación
const authenticateUser = async (req, res, next) => {
  try {
    // Verificar si existe el token en el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado. Se requiere token de autenticación'
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el usuario existe en la base de datos
    const user = await executeQuery(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.id]
    );

    if (user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'El usuario asociado a este token ya no existe'
      });
    }

    // Añadir el usuario a la solicitud para su uso posterior
    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado, por favor inicie sesión nuevamente'
      });
    }

    console.error('Error de autenticación:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en la autenticación'
    });
  }
};

module.exports = {
  authenticateUser
};
