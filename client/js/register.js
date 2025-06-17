/**
 * Script para manejar el registro de usuarios en el frontend
 */

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const errorContainer = document.getElementById('errorContainer');
  const successContainer = document.getElementById('successContainer');

  if (!registerForm) return;

  /**
   * Muestra mensajes de error en el formulario
   */
  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    successContainer.style.display = 'none';
  }

  /**
   * Muestra mensaje de éxito
   */
  function showSuccess(message) {
    successContainer.textContent = message;
    successContainer.style.display = 'block';
    errorContainer.style.display = 'none';
  }

  /**
   * Valida el formulario antes de enviarlo
   */
  function validateForm() {
    // Reiniciar mensajes
    errorContainer.style.display = 'none';

    // Validar nombre
    if (!nameInput.value.trim()) {
      showError('Por favor ingrese su nombre');
      nameInput.focus();
      return false;
    }

    // Validar email
    if (!emailInput.value.trim()) {
      showError('Por favor ingrese su correo electrónico');
      emailInput.focus();
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError('Por favor ingrese un correo electrónico válido');
      emailInput.focus();
      return false;
    }

    // Validar contraseña
    if (!passwordInput.value) {
      showError('Por favor ingrese una contraseña');
      passwordInput.focus();
      return false;
    }

    if (passwordInput.value.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      passwordInput.focus();
      return false;
    }

    // Validar confirmación de contraseña
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError('Las contraseñas no coinciden');
      confirmPasswordInput.focus();
      return false;
    }

    return true;
  }

  /**
   * Maneja el envío del formulario
   */
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    // Deshabilitar botón durante el proceso
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Procesando...';

    try {
      const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de validación
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join('\n');
          showError(errorMessages);
        } else {
          showError(data.message || 'Error al registrar usuario');
        }
        return;
      }

      // Registro exitoso
      showSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      registerForm.reset();

      // Guardar token si está disponible
      if (data.data && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('userName', data.data.user.name);
      }

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      showError('Ocurrió un error al procesar su solicitud. Por favor intente nuevamente.');
    } finally {
      // Restaurar botón
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

  // Limpiar mensajes al escribir
  const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      errorContainer.style.display = 'none';
    });
  });
});
