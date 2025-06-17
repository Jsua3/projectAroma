const { User } = require('../models');

// Obtener perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener perfil', 
      error: error.message 
    });
  }
};

// Actualizar perfil del usuario autenticado
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar si el nuevo email ya está en uso
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'El correo electrónico ya está en uso' 
        });
      }
    }

    // Actualizar usuario
    await user.update({
      name,
      email
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar perfil', 
      error: error.message 
    });
  }
};

// Cambiar contraseña del usuario autenticado
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    await user.update({ password: newPassword });

    res.json({
      success: true,
      data: { message: 'Contraseña actualizada correctamente' }
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar contraseña', 
      error: error.message 
    });
  }
};
