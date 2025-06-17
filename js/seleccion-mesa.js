const mesas = [
    { id: 1, nombre: 'Mesa 1', capacidad: 2 },
    { id: 2, nombre: 'Mesa 2', capacidad: 2 },
    { id: 3, nombre: 'Mesa 3', capacidad: 4 },
    { id: 4, nombre: 'Mesa 4', capacidad: 4 },
    { id: 5, nombre: 'Mesa 5', capacidad: 6 },
    { id: 6, nombre: 'Mesa 6', capacidad: 2 },
    { id: 7, nombre: 'Mesa 7', capacidad: 2 },
    { id: 8, nombre: 'Mesa 8', capacidad: 4 },
    { id: 9, nombre: 'Mesa 9', capacidad: 4 },
    { id: 10, nombre: 'Mesa 10', capacidad: 6 },
    { id: 11, nombre: 'Mesa 11', capacidad: 2 },
    { id: 12, nombre: 'Mesa 12', capacidad: 2 },
    { id: 13, nombre: 'Mesa 13', capacidad: 4 },
    { id: 14, nombre: 'Mesa 14', capacidad: 4 },
    { id: 15, nombre: 'Mesa 15', capacidad: 6 }
];

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('mesas')) {
        localStorage.setItem('mesas', JSON.stringify(mesas));
    }

    const params = new URLSearchParams(window.location.search);
    const eventoId = parseInt(params.get('evento'));

    if (!eventoId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha especificado un evento',
            confirmButtonText: 'Volver a eventos'
        }).then(() => {
            window.location.href = 'eventos.html';
        });
        return;
    }

    mostrarInfoEvento(eventoId);
    cargarMesas(eventoId);

    const confirmarBtn = document.getElementById('confirmar-mesa');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', function() {
            confirmarSeleccionMesa(eventoId);
        });
    }
});

function mostrarInfoEvento(eventoId) {
    const eventoInfoDiv = document.getElementById('evento-info');
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Evento no encontrado',
            confirmButtonText: 'Volver a eventos'
        }).then(() => {
            window.location.href = 'eventos.html';
        });
        return;
    }
// Script para la página de selección de mesa

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!isLoggedIn()) {
        window.location.href = 'login.html?redirect=eventos.html';
        return;
    }

    // Obtener ID del evento desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    if (!eventId) {
        window.location.href = 'eventos.html';
        return;
    }

    // Cargar información del evento y mesas disponibles
    cargarEventoYMesas(eventId);

    // Event listener para el botón de confirmar selección
    const confirmarBtn = document.getElementById('confirmar-mesa');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', function() {
            confirmarReserva(eventId);
        });
    }
});

async function cargarEventoYMesas(eventId) {
    const eventoInfo = document.getElementById('evento-info');
    const mesasGrid = document.getElementById('mesas-grid');

    // Mostrar indicadores de carga
    eventoInfo.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Cargando información del evento...</p>
        </div>
    `;

    mesasGrid.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Cargando mesas disponibles...</p>
        </div>
    `;

    try {
        // Obtener información del evento y mesas disponibles
        const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar información');
        }

        const evento = data.data.event;
        const mesas = data.data.tables;

        // Formatear fecha
        const fecha = new Date(evento.date);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Mostrar información del evento
        eventoInfo.innerHTML = `
            <h3>${evento.title}</h3>
            <p class="evento-fecha"><i class="far fa-calendar"></i> ${fechaFormateada}</p>
            <p class="evento-hora"><i class="far fa-clock"></i> ${evento.time}</p>
            <p>${evento.description}</p>
        `;

        // Limpiar grid de mesas
        mesasGrid.innerHTML = '';

        // Crear y agregar cada mesa al grid
        mesas.forEach(mesa => {
            const mesaElement = document.createElement('div');
            mesaElement.className = `mesa-item ${mesa.isReserved ? 'mesa-ocupada' : 'mesa-disponible'}`;
            mesaElement.dataset.id = mesa.id;

            mesaElement.innerHTML = `
                <div class="mesa-numero">${mesa.number}</div>
                <div class="mesa-info">
                    <span><i class="fas fa-users"></i> ${mesa.capacity}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${mesa.location}</span>
                </div>
            `;

            // Agregar event listener solo si la mesa está disponible
            if (!mesa.isReserved) {
                mesaElement.addEventListener('click', function() {
                    seleccionarMesa(this, mesa.id);
                });
            }

            mesasGrid.appendChild(mesaElement);
        });

    } catch (error) {
        console.error('Error al cargar datos:', error);
        eventoInfo.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar la información del evento.</p>
            </div>
        `;

        mesasGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar las mesas disponibles.</p>
                <button class="btn-small reload-btn">Reintentar</button>
            </div>
        `;

        // Agregar event listener para reintentar
        const reloadBtn = mesasGrid.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', function() {
                cargarEventoYMesas(eventId);
            });
        }
    }
}

function seleccionarMesa(mesaElement, mesaId) {
    // Eliminar selección previa
    const mesaSeleccionadaAnterior = document.querySelector('.mesa-seleccionada');
    if (mesaSeleccionadaAnterior) {
        mesaSeleccionadaAnterior.classList.remove('mesa-seleccionada');
    }

    // Seleccionar nueva mesa
    mesaElement.classList.add('mesa-seleccionada');

    // Guardar selección
    localStorage.setItem('mesaSeleccionada', mesaId);

    // Habilitar botón de confirmar
    const confirmarBtn = document.getElementById('confirmar-mesa');
    if (confirmarBtn) {
        confirmarBtn.disabled = false;
    }
}

async function confirmarReserva(eventId) {
    const mesaId = localStorage.getItem('mesaSeleccionada');

    if (!mesaId) {
        Swal.fire({
            icon: 'warning',
            title: 'Selección requerida',
            text: 'Por favor, selecciona una mesa para continuar'
        });
        return;
    }

    // Mostrar confirmación
    const result = await Swal.fire({
        icon: 'question',
        title: 'Confirmar reserva',
        text: '¿Estás seguro que deseas reservar esta mesa para el evento?',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar reserva',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        // Mostrar indicador de carga
        Swal.fire({
            title: 'Procesando reserva...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Obtener token de autenticación
        const token = localStorage.getItem('token');

        // Realizar petición para crear reserva
        const response = await fetch('http://localhost:3001/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                eventId: parseInt(eventId),
                tableId: parseInt(mesaId)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear reserva');
        }

        // Limpiar selección
        localStorage.removeItem('mesaSeleccionada');

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Reserva confirmada!',
            text: 'Tu reserva ha sido registrada correctamente',
            confirmButtonText: 'Ver mis reservas'
        }).then(() => {
            window.location.href = 'perfil.html';
        });

    } catch (error) {
        console.error('Error al confirmar reserva:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al realizar la reserva',
            text: error.message || 'Ha ocurrido un error al procesar tu solicitud',
            confirmButtonText: 'Entendido'
        });
    }
}
    eventoInfoDiv.innerHTML = `
        <h3>${evento.titulo}</h3>
        <div class="evento-details">
            <span><i class="far fa-calendar"></i> ${evento.fecha}</span>
            <span><i class="far fa-clock"></i> ${evento.hora}</span>
        </div>
        <p>${evento.descripcion}</p>
    `;
}

function cargarMesas(eventoId) {
    const mesasGrid = document.getElementById('mesas-grid');
    const mesas = JSON.parse(localStorage.getItem('mesas')) || [];
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    mesasGrid.innerHTML = '';

    const mesasOcupadas = reservas
        .filter(r => r.eventoId === eventoId)
        .map(r => r.mesaId);

    mesas.forEach(mesa => {
        const mesaDiv = document.createElement('div');
        const ocupada = mesasOcupadas.includes(mesa.id);

        mesaDiv.className = `mesa ${ocupada ? 'ocupada' : 'disponible'}`;
        mesaDiv.innerHTML = `
            <i class="fas fa-chair"></i>
            <p>${mesa.nombre}</p>
            <small>${mesa.capacidad} personas</small>
        `;

        if (!ocupada) {
            mesaDiv.addEventListener('click', function() {
                seleccionarMesa(this, mesa.id);
            });
        }

        mesasGrid.appendChild(mesaDiv);
    });
}

function seleccionarMesa(mesaElement, mesaId) {
    const mesaSeleccionadaAnterior = document.querySelector('.mesa.seleccionada');
    if (mesaSeleccionadaAnterior) {
        mesaSeleccionadaAnterior.classList.remove('seleccionada');
    }

    mesaElement.classList.add('seleccionada');
    localStorage.setItem('mesaSeleccionada', mesaId);

    const confirmarBtn = document.getElementById('confirmar-mesa');
    confirmarBtn.disabled = false;
}

    async function verificarConfiguracionMesas() {
    try {
        const response = await fetch('http://localhost:3001/api/setup/status');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar configuración');
        }

        // Si no hay mesas, mostrar botón para crear mesas iniciales (solo para admin)
        if (!data.data.isConfigured.tables && estaLogueado() && esAdmin()) {
            Swal.fire({
                title: 'Configuración inicial',
                text: 'No hay mesas configuradas. ¿Deseas crear las mesas iniciales?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear mesas',
                cancelButtonText: 'No, más tarde'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await crearMesasIniciales();
                    // Recargar la página después de crear las mesas
                    window.location.reload();
                }
            });
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error al verificar configuración de mesas:', error);
        return true; // Continuar con la carga normal en caso de error
    }
    }

    async function crearMesasIniciales() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch('http://localhost:3001/api/setup/tables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear mesas iniciales');
        }

        Swal.fire({
            title: 'Éxito',
            text: 'Mesas iniciales creadas correctamente',
            icon: 'success'
        });

        return data.data.tables;
    } catch (error) {
        console.error('Error al crear mesas iniciales:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error al crear mesas iniciales',
            icon: 'error'
        });
        return null;
    }
    }

    // Cuando se carga la página de selección de mesas
    document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si hay mesas configuradas
    await verificarConfiguracionMesas();
    });

function confirmarSeleccionMesa(eventoId) {
    const mesaId = parseInt(sessionStorage.getItem('mesaSeleccionada'));
    const userEmail = getCurrentUserEmail();

    if (!mesaId) {
        Swal.fire({
            icon: 'warning',
            title: 'Mesa no seleccionada',
            text: 'Por favor, selecciona una mesa'
        });
        return;
    }

    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const mesas = JSON.parse(localStorage.getItem('mesas')) || [];

    const evento = eventos.find(e => e.id === eventoId);
    const mesa = mesas.find(m => m.id === mesaId);

    const nuevaReserva = {
        id: Date.now(),
        eventoId: eventoId,
        mesaId: mesaId,
        userEmail: userEmail,
        fechaReserva: new Date().toISOString(),
        eventoTitulo: evento.titulo,
        eventoFecha: evento.fecha,
        eventoHora: evento.hora,
        eventoImagen: evento.imagen,
        mesaNombre: mesa.nombre
    };

    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    Swal.fire({
        icon: 'success',
        title: '¡Reserva confirmada!',
        text: `Has reservado la ${mesa.nombre} para el evento "${evento.titulo}".`,
        confirmButtonText: 'Ver mis reservas'
    }).then(() => {
        window.location.href = 'perfil.html';
    });
}
