// Script para manejar el inicio de sesión

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validación simple
            if (!email || !password) {
                alert('Por favor, completa todos los campos');
                return;
            }

            // En un entorno real, aquí se enviarían los datos a un servidor
            // Para este ejemplo, simulamos un inicio de sesión exitoso
            simulateLogin(email, password);
        });
    }
});

// Simula un proceso de inicio de sesión
function simulateLogin(email, password) {
    // Verificar si el usuario está registrado en localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (user && user.password === password) {
        // Inicio de sesión exitoso
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', user.nombre);

        alert('¡Bienvenido de nuevo!');
        window.location.href = 'perfil.html';
    } else {
        alert('Correo electrónico o contraseña incorrectos');
    }
}
