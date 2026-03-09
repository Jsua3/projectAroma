/**
 * Funciones de autenticación para Aroma Café
 */

// URL base de la API
const apiUrl = 'https://projectaroma-production.up.railway.app/api';

/**
 * Verifica si el usuario está logueado
 * @returns {boolean} - true si está logueado, false si no
 */
function estaLogueado() {
    return localStorage.getItem('token') !== null;
}

/**
 * Verifica si el usuario actual es administrador
 * @returns {boolean} - true si es admin, false si no
 */
function esAdmin() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.role === 'admin';
}

/**
 * Obtiene el nombre del usuario actual
 * @returns {string} - Nombre del usuario o cadena vacía
 */
function getNombreUsuario() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.name || '';
}

/**
 * Obtiene el email del usuario actual
 * @returns {string} - Email del usuario o cadena vacía
 */
function getEmailUsuario() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.email || '';
}

/**
 * Obtiene el ID del usuario actual
 * @returns {number|null} - ID del usuario o null
 */
function getIdUsuario() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.id || null;
}

/**
 * Inicia sesión en el sistema
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Datos del usuario y token
 */
async function iniciarSesion(email, password) {
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar token y datos del usuario
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));

        return data.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}

/**
 * Registra un nuevo usuario
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Datos del usuario y token
 */
async function registrarUsuario(name, email, password) {
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        // Guardar token y datos del usuario
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));

        return data.data;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

/**
 * Verifica si el token es válido
 * @returns {Promise<boolean>} - true si el token es válido, false si no
 */
async function verificarToken() {
    if (!estaLogueado()) return false;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            cerrarSesion();
            return false;
        }

        // Actualizar datos del usuario por si han cambiado
        localStorage.setItem('userData', JSON.stringify(data.data.user));

        return true;
    } catch (error) {
        console.error('Error al verificar token:', error);
        cerrarSesion();
        return false;
    }
}

/**
 * Configura la interfaz según el estado de autenticación
 */
function configurarInterfazAuth() {
    const estaAutenticado = estaLogueado();
    const esAdministrador = esAdmin();

    // Elementos de navegación
    const loginNav = document.getElementById('login-nav');
    const logoutNav = document.getElementById('logout-nav');
    const perfilNav = document.getElementById('perfil-nav');
    const adminNav = document.getElementById('admin-nav');

    if (loginNav) loginNav.style.display = estaAutenticado ? 'none' : 'block';
    if (logoutNav) logoutNav.style.display = estaAutenticado ? 'block' : 'none';
    if (perfilNav) perfilNav.style.display = estaAutenticado ? 'block' : 'none';
    if (adminNav) adminNav.style.display = (estaAutenticado && esAdministrador) ? 'block' : 'none';

    // Configurar botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
}

// Configurar interfaz cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    configurarInterfazAuth();

    // Si hay token, verificarlo silenciosamente
    if (estaLogueado()) {
        verificarToken().then(valido => {
            if (valido) {
                configurarInterfazAuth();
            }
        });
    }
});
