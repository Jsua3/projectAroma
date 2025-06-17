const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar token JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No se proporcionó token de autenticación' 
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Agregar usuario al objeto de solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

// Middleware para verificar roles de usuario
exports.authorize = (roles = []) => {
  // Si se proporciona un solo rol como string, convertirlo a array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para acceder a este recurso' 
      });
    }

    next();
  };
};
