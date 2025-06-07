// Funciones para manejo de autenticación y sesiones de usuario

// Función para comprobar si el usuario está logueado
function isLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Función para obtener el email del usuario actual
function getCurrentUserEmail() {
    return localStorage.getItem('userEmail');
}

// Función para obtener el nombre del usuario actual
function getCurrentUserName() {
    return localStorage.getItem('userName') || getCurrentUserEmail().split('@')[0];
}

// Función para actualizar la UI según el estado de sesión
function updateUIBasedOnAuthState() {
    const loginNav = document.getElementById('login-nav');
    const logoutNav = document.getElementById('logout-nav');
    const perfilNav = document.getElementById('perfil-nav');

    if (isLoggedIn()) {
        loginNav.style.display = 'none';
        logoutNav.style.display = 'block';
        perfilNav.style.display = 'block';

        // Verificar token válido con el backend
        verifyAuthToken();
    } else {
        loginNav.style.display = 'block';
        logoutNav.style.display = 'none';

        // Si no estamos en la página de login, mostramos el link al perfil pero
        // redirigiremos al login si lo pulsan
        perfilNav.style.display = 'block';

        // Si el usuario intenta acceder al perfil sin estar logueado
        const perfilLink = perfilNav.querySelector('a');
        if (perfilLink) {
            perfilLink.addEventListener('click', function(e) {
                if (!isLoggedIn()) {
                    e.preventDefault();
                    showNotification('Debes iniciar sesión para acceder a tu perfil', 'error');
                    window.location.href = 'login.html';
                }
            });
        }
    }
}

// Verificar token de autenticación con el backend
async function verifyAuthToken() {
    // Solo verificar si el usuario está logueado
    if (!isLoggedIn()) return;

    try {
        await API.auth.verifyAuth();
    } catch (error) {
        console.error('Error al verificar token:', error);
        // Si hay error, cerrar sesión
        logout();
    }
}

// Función para cerrar sesión
function logout() {
    API.auth.logout();

    // Redireccionar a la página principal
    window.location.href = 'index.html';
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${type}`;

    // Icono según el tipo
    let icono = 'info-circle';
    if (type === 'success') icono = 'check-circle';
    if (type === 'error') icono = 'exclamation-circle';

    notificacion.innerHTML = `
        <i class="fas fa-${icono}"></i>
        <p>${message}</p>
    `;

    // Añadir al DOM
    document.body.appendChild(notificacion);

    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
        notificacion.style.opacity = '1';
    }, 10);

    // Remover después de un tiempo
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        notificacion.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 500);
    }, 3000);
}

// Agregar event listener para el botón de cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que el API.js esté cargado
    if (!window.API) {
        console.error('API no está disponible. Asegúrate de incluir api.js antes de auth.js');
        return;
    }

    // Actualizar UI basada en estado de autenticación
    updateUIBasedOnAuthState();

    // Agregar event listener al botón de logout si existe
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Verificar acceso a páginas protegidas
    const currentPage = window.location.pathname.split('/').pop();
    if ((currentPage === 'perfil.html' || currentPage === 'seleccion-mesa.html') && !isLoggedIn()) {
        showNotification('Debes iniciar sesión para acceder a esta página', 'error');
        window.location.href = 'login.html';
    }
});
