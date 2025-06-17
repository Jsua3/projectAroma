// Script para manejar el inicio de sesión

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validación simple
            if (!email || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos'
                });
                return;
            }

            // Mostrar indicador de carga
            Swal.fire({
                title: 'Iniciando sesión...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Enviar solicitud de inicio de sesión al servidor
                const response = await fetch('http://localhost:3001/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Credenciales inválidas');
                }

                // Guardar token y datos del usuario
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', data.data.user.email);
                localStorage.setItem('userName', data.data.user.name);

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido de nuevo!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'perfil.html';
                });
            } catch (error) {
                console.error('Error de inicio de sesión:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error de autenticación',
                    text: error.message || 'Correo electrónico o contraseña incorrectos'
                });
            }
        });
    }
});
