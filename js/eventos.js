/**
 * Aroma Café - Sistema de Gestión de Eventos
 * 
 * Este archivo proporciona funciones para:  
 * - Cargar eventos desde la API del backend
 * - Mostrar eventos en la interfaz de usuario
 * - Filtrar eventos por categoría
 * - Gestionar reservas de eventos
 * - Administrar eventos (para usuarios admin)
 */

let apiBaseUrl = 'https://projectaroma-production.up.railway.app/api';

// Configuración inicial cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar eventos
    cargarEventos();

    // Cargar eventos destacados para la página de inicio
    cargarEventosDestacados();

    // Configurar formulario de administración de eventos si existe
    configurarFormEventos();

    // Configurar filtros de eventos si existen
    configurarFiltrosEventos();
});

/**
 * Verifica si la configuración inicial del sistema está completa
 * @returns {Promise<boolean>} - True si se puede continuar con la carga, false si no
 */
async function verificarConfiguracion() {
    try {
        const response = await fetch(`${apiBaseUrl}/setup/status`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar configuración');
        }

        // Si no hay eventos y el usuario es admin, ofrecer crear eventos iniciales
        if (!data.data.isConfigured.events && estaLogueado() && esAdmin()) {
            const result = await Swal.fire({
                title: 'Configuración inicial',
                text: 'No hay eventos configurados. ¿Deseas crear los eventos iniciales?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear eventos',
                cancelButtonText: 'No, más tarde'
            });

            if (result.isConfirmed) {
                await crearEventosIniciales();
            }
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error al verificar configuración:', error);
        return true; // Continuar con la carga normal en caso de error
    }
}
    {
        id: 2,
        titulo: 'Taller de Barismo',
        descripcion: 'Aprende los secretos para preparar el café perfecto con nuestros expertos baristas.',
        fecha: '20 de junio, 2025',
        hora: '16:00 - 18:00',
        imagen: './img/eventos/barismo.jpg',
        capacidad: 15
    },
    {
        id: 3,
        titulo: 'Cata de Café de Especialidad',
        descripcion: 'Explora los sabores y aromas de los mejores cafés de especialidad del mundo.',
        fecha: '25 de junio, 2025',
        hora: '17:00 - 19:00',
        imagen: './img/eventos/cata.jpg',
        capacidad: 12
    },
    {
        id: 4,
        titulo: 'Noche de Poesía',
        descripcion: 'Tarde de lectura y recitales poéticos acompañados de la mejor selección de café y té.',
        fecha: '5 de julio, 2025',
        hora: '18:00 - 21:00',
        imagen: './img/eventos/poesia.jpg',
        capacidad: 25
    },
    {
        id: 5,
        titulo: 'Exposición de Arte Local',
        descripcion: 'Exhibición de obras de artistas locales mientras disfrutas de nuestras especialidades.',
        fecha: '12 de julio, 2025',
        hora: '11:00 - 20:00',
        imagen: './img/eventos/arte.jpg',
        capacidad: 30
    },
    {
        id: 6,
        titulo: 'Club de Lectura',
        descripcion: 'Únete a nuestro club mensual de lectura para discutir libros interesantes en un ambiente acogedor.',
        fecha: '18 de julio, 2025',
        hora: '17:00 - 19:00',
        imagen: './img/eventos/lectura.jpg',
        capacidad: 18
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Guardar eventos en localStorage si no existen
    if (!localStorage.getItem('eventos')) {
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }

    // Cargar y mostrar los eventos
    const eventosContainer = document.getElementById('eventos-container');

    if (eventosContainer) {
        cargarEventos();
    }
});

// Función para cargar y mostrar los eventos
// Script para manejar eventos

document.addEventListener('DOMContentLoaded', function() {
    cargarEventos();
});

    async function verificarConfiguracion() {
    try {
        const response = await fetch('https://projectaroma-production.up.railway.app/api/setup/status');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar configuración');
        }

        // Si no hay eventos, mostrar botón para crear eventos iniciales (solo para admin)
        if (!data.data.isConfigured.events && estaLogueado() && esAdmin()) {
            Swal.fire({
                title: 'Configuración inicial',
                text: 'No hay eventos configurados. ¿Deseas crear los eventos iniciales?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear eventos',
                cancelButtonText: 'No, más tarde'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await crearEventosIniciales();
                }
                cargarEventos();
            });
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error al verificar configuración:', error);
        return true; // Continuar con la carga normal en caso de error
    }
    }

    /**
     * Crea eventos iniciales en el sistema
     * @returns {Promise<Array|null>} - Array de eventos creados o null si hay error
     */
    async function crearEventosIniciales() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch(`${apiBaseUrl}/setup/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear eventos iniciales');
        }

        await Swal.fire({
            title: 'Éxito',
            text: 'Eventos iniciales creados correctamente',
            icon: 'success'
        });

        return data.data.events;
    } catch (error) {
        console.error('Error al crear eventos iniciales:', error);
        await Swal.fire({
            title: 'Error',
            text: error.message || 'Error al crear eventos iniciales',
            icon: 'error'
        });
        return null;
    }
    }

    /**
     * Configura los filtros de eventos en la página
     */
    function configurarFiltrosEventos() {
    const botonesFilter = document.querySelectorAll('.btn-filter');
    if (!botonesFilter.length) return;

    botonesFilter.forEach(boton => {
        boton.addEventListener('click', function() {
            // Actualizar clases de los botones
            botonesFilter.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filtrar eventos
            const filtro = this.getAttribute('data-filter');
            filtrarEventos(filtro);
        });
    });
    }

    /**
     * Configura el formulario de administración de eventos si existe
     */
    function configurarFormEventos() {
    const formEvento = document.getElementById('form-evento');
    if (!formEvento) return;

    // Si hay un parámetro de ID en la URL, cargar el evento para edición
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (eventoId) {
        cargarEventoParaEditar(eventoId);
    }

    // Configurar el envío del formulario
    formEvento.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Verificar si el usuario está logueado y es admin
        if (!estaLogueado() || !esAdmin()) {
            Swal.fire({
                title: 'Acceso denegado',
                text: 'Necesitas ser administrador para realizar esta acción',
                icon: 'error'
            });
            return;
        }

        // Recoger datos del formulario
        const formData = new FormData(formEvento);
        const eventoData = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            capacity: parseInt(formData.get('capacity')),
            price: parseFloat(formData.get('price')),
            isActive: formData.get('isActive') === 'on',
            image: formData.get('image')
        };

        try {
            const token = localStorage.getItem('token');
            let response;

            if (eventoId) {
                // Actualizar evento existente
                response = await fetch(`${apiBaseUrl}/events/${eventoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(eventoData)
                });
            } else {
                // Crear nuevo evento
                response = await fetch(`${apiBaseUrl}/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(eventoData)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al guardar el evento');
            }

            Swal.fire({
                title: 'Éxito',
                text: eventoId ? 'Evento actualizado correctamente' : 'Evento creado correctamente',
                icon: 'success'
            }).then(() => {
                window.location.href = 'admin-eventos.html';
            });
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al guardar el evento',
                icon: 'error'
            });
        }
    });
    }

    /**
     * Carga un evento para editar en el formulario
     * @param {number} id - ID del evento a editar
     */
    async function cargarEventoParaEditar(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/events/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar el evento');
        }

        const evento = data.data.event;

        // Llenar el formulario con los datos del evento
        document.getElementById('event-title').value = evento.title;
        document.getElementById('event-description').value = evento.description;
        document.getElementById('event-date').value = evento.date;
        document.getElementById('event-time').value = evento.time;
        document.getElementById('event-capacity').value = evento.capacity;
        document.getElementById('event-price').value = evento.price;
        document.getElementById('event-image').value = evento.image;
        document.getElementById('event-active').checked = evento.isActive;

        // Actualizar el título del formulario
        document.querySelector('h2').textContent = 'Editar Evento';
    } catch (error) {
        console.error('Error al cargar el evento para editar:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error al cargar el evento para editar',
            icon: 'error'
        }).then(() => {
            window.location.href = 'admin-eventos.html';
        });
    }
    }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear eventos iniciales');
        }

        Swal.fire({
            title: 'Éxito',
            text: 'Eventos iniciales creados correctamente',
            icon: 'success'
        });

        return data.data.events;
    } catch (error) {
        console.error('Error al crear eventos iniciales:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error al crear eventos iniciales',
            icon: 'error'
        });
        return null;
    }
    }

    // Función para crear un elemento de evento
    function crearElementoEvento(evento) {
    // Formatear fecha para mostrar
    const fechaEvento = new Date(evento.date + 'T' + evento.time);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaEvento.toLocaleDateString('es-ES', opciones);
    const horaFormateada = evento.time.substring(0, 5); // Tomar solo HH:MM

    // Determinar categoría para filtrado
    let categoria = 'otros';
    if (evento.title.toLowerCase().includes('taller') || evento.title.toLowerCase().includes('cata')) {
        categoria = 'talleres';
    } else if (evento.title.toLowerCase().includes('jazz') || evento.title.toLowerCase().includes('música') || evento.title.toLowerCase().includes('musica')) {
        categoria = 'musica';
    } else if (evento.title.toLowerCase().includes('arte') || evento.title.toLowerCase().includes('poesía') || evento.title.toLowerCase().includes('lectura')) {
        categoria = 'arte';
    }

    // Crear elemento del evento
    const eventoElement = document.createElement('div');
    eventoElement.className = 'evento-card';
    eventoElement.setAttribute('data-categoria', categoria);
    eventoElement.setAttribute('data-id', evento.id);

    // Contenido base del evento
    let contenidoHTML = `
        <div class="evento-imagen">
            <img src="${evento.image}" alt="${evento.title}">
            <div class="evento-precio">${evento.price ? '€' + parseFloat(evento.price).toFixed(2) : 'Gratis'}</div>
        </div>
        <div class="evento-info">
            <h3>${evento.title}</h3>
            <p class="evento-fecha"><i class="far fa-calendar-alt"></i> ${fechaFormateada}</p>
            <p class="evento-hora"><i class="far fa-clock"></i> ${horaFormateada}</p>
            <p class="evento-capacidad"><i class="fas fa-users"></i> Capacidad: ${evento.capacity} personas</p>
            <p class="evento-descripcion">${evento.description}</p>
            <div class="evento-actions">
                ${tieneReserva ? 
                    '<button class="btn-small btn-reservado" disabled>Ya reservado</button>' :
                    `<button class="btn-small btn-reservar" data-id="${evento.id}">Reservar mesa</button>`
                }
    `;

    // Añadir controles de administración si corresponde
    if (mostrarControlesAdmin) {
        contenidoHTML += `
                <div class="admin-controls">
                    <a href="admin-evento-form.html?id=${evento.id}" class="btn-small btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </a>
                    <button class="btn-small btn-delete" data-id="${evento.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
        `;
    }

    // Cerrar div de acciones y de info
    contenidoHTML += `
            </div>
        </div>
    `;

    // Asignar el HTML al elemento
    eventoElement.innerHTML = contenidoHTML;

    // Añadir event listener al botón de reserva si existe
    const btnReservar = eventoElement.querySelector('.btn-reservar');
    if (btnReservar) {
        btnReservar.addEventListener('click', function() {
            if (!estaLogueado()) {
                Swal.fire({
                    title: 'Iniciar sesión requerido',
                    text: 'Debes iniciar sesión para reservar una mesa',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Iniciar sesión',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `login.html?redirect=eventos.html`;
                    }
                });
            } else {
                // Redirigir a la página de selección de mesa con el ID del evento
                window.location.href = `seleccion-mesa.html?evento=${evento.id}`;
            }
        });
    }

    // Añadir event listener al botón de eliminar si existe
    const btnEliminar = eventoElement.querySelector('.btn-delete');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', async function() {
            const eventoId = this.getAttribute('data-id');

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                eliminarEvento(eventoId);
            }
        });
    }

    return eventoElement;
    }

    return eventoElement;
    }

    /**
     * Filtra los eventos mostrados según la categoría seleccionada
     * @param {string} filtro - Categoría a filtrar ('todos', 'talleres', 'musica', 'arte')
     */
    function filtrarEventos(filtro) {
    const eventos = document.querySelectorAll('.evento-card');

    eventos.forEach(evento => {
        const categoria = evento.getAttribute('data-categoria');

        if (filtro === 'todos' || filtro === categoria) {
            evento.style.display = 'block';
        } else {
            evento.style.display = 'none';
        }
    });
    }

    /**
     * Elimina un evento
     * @param {number} id - ID del evento a eliminar
     */
    async function eliminarEvento(id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch(`${apiBaseUrl}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar el evento');
        }

        await Swal.fire({
            title: 'Eliminado',
            text: 'El evento ha sido eliminado correctamente',
            icon: 'success'
        });

        // Recargar eventos
        cargarEventos();
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        await Swal.fire({
            title: 'Error',
            text: error.message || 'Error al eliminar el evento',
            icon: 'error'
        });
    }
    }

    async function verificarConfiguracion() {
    try {
        const response = await fetch('https://projectaroma-production.up.railway.app/api/setup/status');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar configuración');
        }

        // Si no hay eventos, mostrar botón para crear eventos iniciales (solo para admin)
        if (!data.data.isConfigured.events && estaLogueado() && esAdmin()) {
            Swal.fire({
                title: 'Configuración inicial',
                text: 'No hay eventos configurados. ¿Deseas crear los eventos iniciales?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear eventos',
                cancelButtonText: 'No, más tarde'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await crearEventosIniciales();
                }
                cargarEventos();
            });
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error al verificar configuración:', error);
        return true; // Continuar con la carga normal en caso de error
    }
    }

    async function crearEventosIniciales() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch('https://projectaroma-production.up.railway.app/api/setup/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear eventos iniciales');
        }

        Swal.fire({
            title: 'Éxito',
            text: 'Eventos iniciales creados correctamente',
            icon: 'success'
        });

        return data.data.events;
    } catch (error) {
        console.error('Error al crear eventos iniciales:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error al crear eventos iniciales',
            icon: 'error'
        });
        return null;
    }
    }

    /**
     * Carga eventos desde la API y los muestra en el contenedor
     */
    async function cargarEventos() {
    const eventosContainer = document.getElementById('eventos-container');
    if (!eventosContainer) return;

    // Verificar configuración inicial antes de cargar eventos
    const continuar = await verificarConfiguracion();
    if (!continuar) {
        cargarEventos(); // Recargar después de crear eventos iniciales
        return;
    }

    // Mostrar indicador de carga
    eventosContainer.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Cargando eventos...</p>
        </div>
    `;

    try {
        // Obtener eventos de la API
        const response = await fetch(`${apiBaseUrl}/events?active=true`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar eventos');
        }

        const eventos = data.data.events;

        // Limpiar el contenedor
        eventosContainer.innerHTML = '';

        // Mostrar mensaje si no hay eventos
        if (eventos.length === 0) {
            eventosContainer.innerHTML = `
                <div class="no-events">
                    <i class="far fa-calendar-times"></i>
                    <p>No hay eventos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        // Verificar si debe mostrar controles de administración
        const mostrarControlesAdmin = estaLogueado() && esAdmin();

        // Crear y agregar cada evento al contenedor
        eventos.forEach(evento => {
            const eventoElement = crearElementoEvento(evento, mostrarControlesAdmin);
            eventosContainer.appendChild(eventoElement);
        });

        // Si hay filtro activo, aplicarlo
        const filtroActivo = document.querySelector('.btn-filter.active');
        if (filtroActivo && filtroActivo.getAttribute('data-filter') !== 'todos') {
            filtrarEventos(filtroActivo.getAttribute('data-filter'));
        }

        if (eventos.length === 0) {
            eventosContainer.innerHTML = `
                <div class="no-events">
                    <i class="far fa-calendar-times"></i>
                    <p>No hay eventos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        // Crear y agregar cada evento al contenedor
        eventos.forEach(evento => {
            const eventoElement = crearElementoEvento(evento);
            eventosContainer.appendChild(eventoElement);
        });
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        eventosContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar los eventos. Por favor, intenta de nuevo más tarde.</p>
                <button class="btn-small reload-btn">Reintentar</button>
            </div>
        `;

        // Agregar event listener para reintentar
        const reloadBtn = eventosContainer.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', cargarEventos);
        }
            }
        }

        /**
         * Carga eventos destacados para la página principal
         */
        async function cargarEventosDestacados() {
            const eventosDestacados = document.getElementById('eventos-destacados');
            if (!eventosDestacados) return;

            try {
        // Obtener eventos destacados (limitados a 2)
        const response = await fetch(`${apiBaseUrl}/events?active=true&limit=2`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar eventos destacados');
        }

        const eventos = data.data.events;

        // Limpiar contenedor
        eventosDestacados.innerHTML = '';

        if (eventos.length === 0) {
            eventosDestacados.innerHTML = `
                <div class="no-events">
                    <p>No hay eventos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        // Mostrar solo los primeros 2 eventos
        eventos.forEach(evento => {
            // Formatear fecha
            const fechaEvento = new Date(evento.date + 'T' + evento.time);
            const opciones = { day: 'numeric', month: 'long' };
            const fechaFormateada = fechaEvento.toLocaleDateString('es-ES', opciones);

            const eventoHTML = `
                <div class="evento-card">
                    <img src="${evento.image}" alt="${evento.title}">
                    <h3>${evento.title}</h3>
                    <p class="evento-fecha"><i class="far fa-calendar-alt"></i> ${fechaFormateada}</p>
                    <p>${evento.description.substring(0, 100)}...</p>
                    <a href="eventos.html" class="btn-small">Ver más</a>
                </div>
            `;

            eventosDestacados.innerHTML += eventoHTML;
        });
            } catch (error) {
        console.error('Error al cargar eventos destacados:', error);
        eventosDestacados.innerHTML = `
            <div class="error-message">
                <p>Error al cargar los eventos destacados.</p>
            </div>
        `;
            }

        // Agregar event listener para reintentar
        const reloadBtn = eventosContainer.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', cargarEventos);
        }
    }
}

function crearElementoEvento(evento) {
    // Crear elemento para el evento
    const eventoElement = document.createElement('div');
    eventoElement.className = 'evento-card';

    // Formatear fecha
    const fecha = new Date(evento.date);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Crear HTML del evento
    eventoElement.innerHTML = `
        <img src="${evento.image || './img/evento-default.jpg'}" alt="${evento.title}">
        <h3>${evento.title}</h3>
        <p class="evento-fecha"><i class="far fa-calendar"></i> ${fechaFormateada}</p>
        <p class="evento-hora"><i class="far fa-clock"></i> ${evento.time}</p>
        <p>${evento.description}</p>
        <a href="seleccion-mesa.html?eventId=${evento.id}" class="btn-small reservar-btn">Reservar</a>
    `;

    // Verificar si el usuario está logueado para la reserva
    const reservarBtn = eventoElement.querySelector('.reservar-btn');
    reservarBtn.addEventListener('click', function(e) {
        if (!isLoggedIn()) {
            e.preventDefault();
            Swal.fire({
                icon: 'info',
                title: 'Inicio de sesión requerido',
                text: 'Debes iniciar sesión para reservar un lugar en este evento',
                confirmButtonText: 'Iniciar sesión',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `login.html?redirect=eventos.html`;
                }
            });
        }
    });

    return eventoElement;
}

/**
 * Crea un elemento DOM para mostrar un evento
 * @param {Object} evento - Datos del evento
 * @param {boolean} mostrarControlesAdmin - Si debe mostrar controles de administración
 * @returns {HTMLElement} - Elemento DOM del evento
 */
function crearElementoEvento(evento, mostrarControlesAdmin = false) {
    // Formatear fecha para mostrar
    const fechaEvento = new Date(evento.date + 'T' + evento.time);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaEvento.toLocaleDateString('es-ES', opciones);
    const horaFormateada = evento.time.substring(0, 5); // Tomar solo HH:MM

    // Determinar categoría para filtrado
    let categoria = 'otros';
    if (evento.title.toLowerCase().includes('taller') || evento.title.toLowerCase().includes('cata')) {
        categoria = 'talleres';
    } else if (evento.title.toLowerCase().includes('jazz') || evento.title.toLowerCase().includes('música') || evento.title.toLowerCase().includes('musica')) {
        categoria = 'musica';
    } else if (evento.title.toLowerCase().includes('arte') || evento.title.toLowerCase().includes('poesía') || evento.title.toLowerCase().includes('lectura') || evento.title.toLowerCase().includes('poesia')) {
        categoria = 'arte';
    }

    // Crear elemento del evento
    const eventoElement = document.createElement('div');
    eventoElement.className = 'evento-card';
    eventoElement.setAttribute('data-categoria', categoria);
    eventoElement.setAttribute('data-id', evento.id);

    // Verificar si el usuario ya tiene una reserva para este evento
    let tieneReserva = false;
    if (estaLogueado()) {
        // Aquí se podría verificar con la API si el usuario tiene reserva
        // Por simplicidad, esto se implementaría conectándose al endpoint adecuado
    }

    eventoDiv.innerHTML = `
        <img src="${evento.imagen}" alt="${evento.titulo}">
        <div class="evento-content">
            <h3>${evento.titulo}</h3>
            <div class="evento-details">
                <span><i class="far fa-calendar"></i> ${evento.fecha}</span>
                <span><i class="far fa-clock"></i> ${evento.hora}</span>
            </div>
            <p>${evento.descripcion}</p>
            ${yaRegistrado ? 
                '<button class="btn-small" disabled>Ya registrado</button>' : 
                `<button class="btn-small btn-interes" data-id="${evento.id}">Me interesa</button>`
            }
        </div>
    `;

    // Agregar event listener al botón 'Me interesa'
    const botonInteres = eventoDiv.querySelector('.btn-interes');
    if (botonInteres) {
        botonInteres.addEventListener('click', function() {
            const eventoId = this.getAttribute('data-id');
            if (isLoggedIn()) {
                window.location.href = `seleccion-mesa.html?evento=${eventoId}`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Inicio de sesión requerido',
                    text: 'Debes iniciar sesión para registrarte en un evento',
                    confirmButtonText: 'Ir a iniciar sesión'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    }

    return eventoDiv;
}
