// Cliente de API para comunicarse con el backend

// URL base de la API
const API_URL = 'http://localhost:3001/api';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const API = {
  // Método general para hacer peticiones
  request: async function(endpoint, options = {}) {
    try {
      // Agregar token de autenticación si existe
      const token = getAuthToken();
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      // Configuración por defecto
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      // Combinar opciones
      const fetchOptions = {
        ...defaultOptions,
        ...options
      };

      console.log(`Realizando petición a: ${API_URL}${endpoint}`);

      // Realizar petición
      const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

      // Convertir respuesta a JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error al procesar JSON:', e);
        throw new Error('Error al procesar la respuesta del servidor');
      }

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        console.error('Respuesta de error del servidor:', data);
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error(`Error en API (${endpoint}):`, error);

      // Mejorar mensajes de error para problemas de red
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifique su conexión a internet o que el servidor esté en funcionamiento.');
      }

      throw error;
    }
  },

  // Módulo de autenticación
  auth: {
    login: async (email, password) => {
      return API.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },
    register: async (userData) => {
      console.log('Enviando datos de registro:', userData);
      return API.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    verifyAuth: async () => {
      return API.request('/auth/verify');
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    }
  },

  // Módulo de usuarios
  users: {
    getUserProfile: async () => {
      return API.request('/users/me');
    },
    updateProfile: async (userData) => {
      return API.request('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    }
  }
};

// Exportar API para uso en otros archivos
window.API = API;
