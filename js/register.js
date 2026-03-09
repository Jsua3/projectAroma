// Script para manejar el registro de usuarios

document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');

    if (registroForm) {
        registroForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validación básica
            if (!nombre || !email || !password || !confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos'
                });
                return;
            }

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en las contraseñas',
                    text: 'Las contraseñas no coinciden'
                });
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email inválido',
                    text: 'Por favor, introduce un correo electrónico válido'
                });
                return;
            }

            // Mostrar indicador de carga
            Swal.fire({
                title: 'Creando cuenta...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Realizar petición al servidor
                const response = await fetch('https://projectaroma-production.up.railway.app/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nombre,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al registrar usuario');
                }

                // Guardar token y datos del usuario
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', data.data.user.email);
                localStorage.setItem('userName', data.data.user.name);

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    window.location.href = 'perfil.html';
                });
            } catch (error) {
                console.error('Error en registro:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrarse',
                    text: error.message || 'Ha ocurrido un error al procesar tu solicitud'
                });
            }
        });
    }
});
