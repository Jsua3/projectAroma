// Script para manejar el registro de usuarios

document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');

    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validación simple
            if (!nombre || !email || !password || !confirmPassword) {
                alert('Por favor, completa todos los campos');
                return;
            }

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Verificar que el email no esté ya registrado
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                alert('Este correo electrónico ya está registrado');
                return;
            }

            // Registrar nuevo usuario
            registerUser(nombre, email, password);
        });
    }
});

// Función para registrar un nuevo usuario
function registerUser(nombre, email, password) {
    // Obtener usuarios existentes o crear array vacío
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Agregar nuevo usuario
    users.push({
        nombre: nombre,
        email: email,
        password: password
    });

    // Guardar en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Iniciar sesión automáticamente
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', nombre);

    alert('¡Registro exitoso! Bienvenido a Aroma Café');

    // Redireccionar a la página de perfil
    window.location.href = 'perfil.html';
}
