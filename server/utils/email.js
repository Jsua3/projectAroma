const nodemailer = require('nodemailer');

// Configurar transporte de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar correo de restablecimiento de contraseña
const sendPasswordResetEmail = async (email, resetToken) => {
  // URL frontend para resetear contraseña
  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `Aroma Café <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Restablecimiento de contraseña - Aroma Café',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6F4E37;">Restablecimiento de contraseña</h2>
        <p>Has recibido este correo porque tú (o alguien más) ha solicitado restablecer la contraseña para tu cuenta en Aroma Café.</p>
        <p>Por favor, haz clic en el siguiente enlace para completar el proceso de restablecimiento:</p>
        <p>
          <a href="${resetURL}" style="display: inline-block; background-color: #6F4E37; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Restablecer mi contraseña
          </a>
        </p>
        <p>Si no solicitaste este restablecimiento, simplemente ignora este correo y tu contraseña permanecerá sin cambios.</p>
        <p>Este enlace es válido por 1 hora.</p>
        <hr style="border: 1px solid #f1f1f1;">
        <p style="font-size: 12px; color: #888888;">Aroma Café - Tu lugar de encuentro favorito</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de restablecimiento enviado a: ${email}`);
    return true;
  } catch (error) {
    console.error('Error al enviar correo de restablecimiento:', error);
    return false;
  }
};

// Enviar correo de confirmación de reserva
const sendReservationConfirmation = async (userEmail, reservation) => {
  const mailOptions = {
    from: `Aroma Café <${process.env.EMAIL_FROM}>`,
    to: userEmail,
    subject: 'Confirmación de Reserva - Aroma Café',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6F4E37;">¡Tu reserva ha sido confirmada!</h2>

        <div style="background-color: #f8f4e5; border-left: 4px solid #6F4E37; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #6F4E37;">${reservation.event_title}</h3>
          <p><strong>Fecha:</strong> ${new Date(reservation.event_date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${reservation.event_time}</p>
          <p><strong>Mesa:</strong> ${reservation.table_name}</p>
        </div>

        <p>Gracias por reservar con Aroma Café. Te esperamos para disfrutar de un momento especial.</p>

        <p>Si necesitas cancelar tu reserva, puedes hacerlo desde tu perfil en nuestra página web.</p>

        <hr style="border: 1px solid #f1f1f1;">
        <p style="font-size: 12px; color: #888888;">Aroma Café - Calle Café 123, Ciudad | (123) 456-7890 | info@aromacafe.com</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de confirmación de reserva enviado a: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error al enviar correo de confirmación de reserva:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendReservationConfirmation
};
