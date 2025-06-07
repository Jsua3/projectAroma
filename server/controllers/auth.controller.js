const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { executeQuery } = require('../config/database');
const { sendPasswordResetEmail } = require('../utils/email');

// Registrar un nuevo usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar datos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el email ya está registrado
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Este correo electrónico ya está registrado'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario
    const result = await executeQuery(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      data: {
        user: {
          id: result.insertId,
          name,
          email
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar el usuario'
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos requeridos
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Correo electrónico y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const users = await executeQuery(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Eliminar la contraseña de la respuesta
    delete user.password;

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión'
    });
  }
};

// Solicitar restablecimiento de contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione su correo electrónico'
      });
    }

    // Buscar usuario por email
    const users = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // No informamos al cliente si el email existe o no por razones de seguridad
      return res.status(200).json({
        status: 'success',
        message: 'Si su correo está registrado, recibirá un enlace para restablecer su contraseña'
      });
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // Expira en 1 hora

    // Actualizar usuario con el token
    await executeQuery(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [resetToken, resetTokenExpires, email]
    );

    // Enviar email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Si su correo está registrado, recibirá un enlace para restablecer su contraseña'
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar la solicitud de restablecimiento de contraseña'
    });
  }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    // Buscar usuario con el token y verificar que no haya expirado
    const users = await executeQuery(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Token inválido o expirado'
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Actualizar contraseña y limpiar token
    await executeQuery(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?',
      [hashedPassword, token]
    );

    res.status(200).json({
      status: 'success',
      message: 'Contraseña restablecida correctamente'
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al restablecer la contraseña'
    });
  }
};

// Verificar si el usuario está autenticado
const verifyAuth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Usuario autenticado',
    data: {
      user: req.user
    }
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyAuth
};
