// Script para la página de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar el nombre de usuario
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = getCurrentUserName();
    }

    // Mostrar correo electrónico del usuario
    const userEmailElement = document.getElementById('user-email');
    if (userEmailElement) {
        userEmailElement.textContent = getCurrentUserEmail();
    }

    // Cargar y mostrar reservas del usuario
    cargarReservasUsuario();

    // Event listener para el botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro que deseas cerrar la sesión?')) {
                logout();
            }
        });
    }

    // Cargar perfil desde el servidor
    loadUserProfile();
});

// Cargar perfil del usuario desde el servidor
async function loadUserProfile() {
    try {
        const response = await API.users.getUserProfile();
        const user = response.data.user;

        // Actualizar información en localStorage
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);

        // Actualizar UI
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }

        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        showNotification('Error al cargar tu perfil', 'error');
    }
}

// Función para cargar y mostrar las reservas del usuario
async function cargarReservasUsuario() {
    const reservasContainer = document.getElementById('user-reservations');

    // Mostrar indicador de carga
    reservasContainer.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Cargando reservas...</p>
        </div>
    `;

    try {
        // Obtener reservas desde la API
        const response = await API.reservations.getUserReservations();
        const reservas = response.data.reservations;

        // Limpiar el contenedor
        reservasContainer.innerHTML = '';

        if (!reservas || reservas.length === 0) {
            reservasContainer.innerHTML = `
                <div class="no-reservations">
                    <i class="far fa-calendar-times"></i>
                    <p>No tienes reservas de eventos actualmente.</p>
                    <a href="eventos.html" class="btn-small">Ver eventos disponibles</a>
                </div>
            `;
            return;
        }

        // Crear y agregar cada reserva al contenedor
        reservas.forEach(reserva => {
            const reservaElement = document.createElement('div');
            reservaElement.className = 'event-reservation';

            // Formatear fecha para mejor visualización
            const fechaEvento = new Date(reserva.event_date);
            const fechaFormateada = fechaEvento.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Verificar si el evento ya pasó
            const eventoPasado = fechaEvento < new Date();

            reservaElement.innerHTML = `
                <img src="${reserva.event_image || './img/evento-default.jpg'}" alt="${reserva.event_title}">
                <div class="reservation-details">
                    <h4>${reserva.event_title}</h4>
                    <div class="reservation-info">
                        <span><i class="far fa-calendar"></i> ${fechaFormateada}</span>
                        <span><i class="far fa-clock"></i> ${reserva.event_time}</span>
                        <span><i class="fas fa-chair"></i> Mesa: ${reserva.table_name}</span>
                        ${reserva.status === 'canceled' ? 
                            '<span class="reservation-canceled"><i class="fas fa-ban"></i> Cancelada</span>' : ''}
                    </div>
                    ${(!eventoPasado && reserva.status !== 'canceled') ? `
                        <div class="reservation-actions">
                            <button class="btn-small cancelar-reserva" data-id="${reserva.id}">
                                <i class="fas fa-times-circle"></i> Cancelar reserva
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;

            // Agregar event listener para cancelar reserva
            const cancelarBtn = reservaElement.querySelector('.cancelar-reserva');
            if (cancelarBtn) {
                cancelarBtn.addEventListener('click', function() {
                    const reservaId = parseInt(this.getAttribute('data-id'));
                    cancelarReserva(reservaId);
                });
            }

            reservasContainer.appendChild(reservaElement);
        });
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        reservasContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar las reservas. Por favor, intenta de nuevo más tarde.</p>
                <button class="btn-small reload-btn">Reintentar</button>
            </div>
        `;

        // Agregar event listener para reintentar
        const reloadBtn = reservasContainer.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', cargarReservasUsuario);
        }
    }
}

// Función para cancelar una reserva
async function cancelarReserva(reservaId) {
    if (confirm('¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
        try {
            // Obtener el elemento de la reserva para animación
            const reservaElement = document.querySelector(`.cancelar-reserva[data-id="${reservaId}"]`).closest('.event-reservation');

            // Animación de desvanecimiento
            reservaElement.style.transition = 'opacity 0.5s, transform 0.5s';
            reservaElement.style.opacity = '0';
            reservaElement.style.transform = 'translateX(20px)';

            // Cancelar la reserva en el servidor
            await API.reservations.cancelReservation(reservaId);

            // Recargar reservas después de la animación
            setTimeout(() => {
                cargarReservasUsuario();
                showNotification('Reserva cancelada correctamente', 'success');
            }, 500);

        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            showNotification('Error al cancelar la reserva. Intenta de nuevo más tarde.', 'error');

            // Restaurar animación si hubo error
            const reservaElement = document.querySelector(`.cancelar-reserva[data-id="${reservaId}"]`).closest('.event-reservation');
            if (reservaElement) {
                reservaElement.style.opacity = '1';
                reservaElement.style.transform = 'translateX(0)';
            }
        }
    }
}
