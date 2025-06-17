// Cliente de API para comunicarse con el backend
// NOTA: Este archivo es una alternativa a api-client.js
// Para evitar conflictos, este archivo no exporta variables globales

// URL base de la API
const API_URL = 'http://localhost:3001/api';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para realizar peticiones a la API
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  // Configuración por defecto de las peticiones
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Añadir token de autenticación si existe
  const token = getAuthToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Combinar opciones por defecto con las opciones proporcionadas
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      throw new Error(data.message || 'Ha ocurrido un error');
    }

    return data;
  } catch (error) {
    console.error('Error en la petición a la API:', error);
    throw error;
  }
};

// API de autenticación
const authAPI = {
  // Registrar usuario
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Iniciar sesión
  login: async (credentials) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    // Guardar token y datos del usuario en localStorage
    if (data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', data.data.user.email);
      localStorage.setItem('userName', data.data.user.name);
    }

    return data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  },

  // Solicitar restablecimiento de contraseña
  forgotPassword: async (email) => {
    return fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Restablecer contraseña
  resetPassword: async (token, password) => {
    return fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  },

  // Verificar autenticación
  verifyAuth: async () => {
    return fetchAPI('/auth/verify');
  }
};

// API de eventos
const eventsAPI = {
  // Obtener todos los eventos
  getAllEvents: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchAPI(`/events?${queryParams}`);
  },

  // Obtener un evento por ID
  getEventById: async (id) => {
    return fetchAPI(`/events/${id}`);
  },

  // Crear un nuevo evento (admin)
  createEvent: async (eventData) => {
    return fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },

  // Actualizar un evento (admin)
  updateEvent: async (id, eventData) => {
    return fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },

  // Eliminar un evento (admin)
  deleteEvent: async (id) => {
    return fetchAPI(`/events/${id}`, {
      method: 'DELETE'
    });
  }
};

// API de mesas
const tablesAPI = {
  // Obtener todas las mesas
  getAllTables: async () => {
    return fetchAPI('/tables');
  },

  // Obtener mesas disponibles para un evento
  getAvailableTables: async (eventId) => {
    return fetchAPI(`/tables/available/${eventId}`);
  }
};

// API de reservas
const reservationsAPI = {
  // Obtener reservas del usuario
  getUserReservations: async () => {
    return fetchAPI('/reservations');
  },

  // Crear una nueva reserva
  createReservation: async (reservationData) => {
    return fetchAPI('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  },

  // Cancelar una reserva
  cancelReservation: async (id) => {
    return fetchAPI(`/reservations/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  // Obtener detalles de una reserva
  getReservationById: async (id) => {
    return fetchAPI(`/reservations/${id}`);
  }
};

// API de usuarios
const usersAPI = {
  // Obtener perfil del usuario
  getUserProfile: async () => {
    return fetchAPI('/users/me');
  },

  // Actualizar perfil del usuario
  updateUserProfile: async (userData) => {
    return fetchAPI('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    return fetchAPI('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }
};

// Exportar todas las APIs
const LocalAPI = {
  auth: authAPI,
  events: eventsAPI,
  tables: tablesAPI,
  reservations: reservationsAPI,
  users: usersAPI
};

// Solo asignar al objeto global si no existe ya un objeto API
if (!window.API) {
  window.API = LocalAPI;
  console.log('API local inicializada correctamente');
} else {
  console.log('Se detectó API existente, no se sobrescribirá');
}
