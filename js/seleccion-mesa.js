// Script para la selección de mesas

// Datos de mesas (se cargará en localStorage)
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
    // Guardar mesas en localStorage si no existen
    if (!localStorage.getItem('mesas')) {
        localStorage.setItem('mesas', JSON.stringify(mesas));
    }

    // Obtener el ID del evento de la URL
    const params = new URLSearchParams(window.location.search);
    const eventoId = parseInt(params.get('evento'));

    if (!eventoId) {
        alert('Error: No se ha especificado un evento');
        window.location.href = 'eventos.html';
        return;
    }

    // Mostrar información del evento
    mostrarInfoEvento(eventoId);

    // Cargar y mostrar las mesas disponibles
    cargarMesas(eventoId);

    // Configurar el botón de confirmación
    const confirmarBtn = document.getElementById('confirmar-mesa');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', function() {
            confirmarSeleccionMesa(eventoId);
        });
    }
});

// Función para mostrar la información del evento
function mostrarInfoEvento(eventoId) {
    const eventoInfoDiv = document.getElementById('evento-info');
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) {
        alert('Error: Evento no encontrado');
        window.location.href = 'eventos.html';
        return;
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

// Función para cargar y mostrar las mesas
function cargarMesas(eventoId) {
    const mesasGrid = document.getElementById('mesas-grid');
    const mesas = JSON.parse(localStorage.getItem('mesas')) || [];
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Limpiar el contenedor
    mesasGrid.innerHTML = '';

    // Determinar mesas ocupadas para este evento
    const mesasOcupadas = reservas
        .filter(r => r.eventoId === eventoId)
        .map(r => r.mesaId);

    // Crear y agregar cada mesa al contenedor
    mesas.forEach(mesa => {
        const mesaDiv = document.createElement('div');
        const ocupada = mesasOcupadas.includes(mesa.id);

        mesaDiv.className = `mesa ${ocupada ? 'ocupada' : 'disponible'}`;
        mesaDiv.innerHTML = `
            <i class="fas fa-chair"></i>
            <p>${mesa.nombre}</p>
            <small>${mesa.capacidad} personas</small>
        `;

        // Si la mesa no está ocupada, permitir selección
        if (!ocupada) {
            mesaDiv.addEventListener('click', function() {
                seleccionarMesa(this, mesa.id);
            });
        }

        mesasGrid.appendChild(mesaDiv);
    });
}

// Función para manejar la selección de mesa
function seleccionarMesa(mesaElement, mesaId) {
    // Remover selección previa
    const mesaSeleccionadaAnterior = document.querySelector('.mesa.seleccionada');
    if (mesaSeleccionadaAnterior) {
        mesaSeleccionadaAnterior.classList.remove('seleccionada');
    }

    // Marcar nueva selección
    mesaElement.classList.add('seleccionada');

    // Guardar ID de mesa seleccionada
    sessionStorage.setItem('mesaSeleccionada', mesaId);

    // Habilitar botón de confirmación
    const confirmarBtn = document.getElementById('confirmar-mesa');
    confirmarBtn.disabled = false;
}

// Función para confirmar la selección de mesa
function confirmarSeleccionMesa(eventoId) {
    const mesaId = parseInt(sessionStorage.getItem('mesaSeleccionada'));
    const userEmail = getCurrentUserEmail();

    if (!mesaId) {
        alert('Por favor, selecciona una mesa');
        return;
    }

    // Obtener eventos y mesas para tener información completa
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const mesas = JSON.parse(localStorage.getItem('mesas')) || [];

    const evento = eventos.find(e => e.id === eventoId);
    const mesa = mesas.find(m => m.id === mesaId);

    // Crear nueva reserva
    const nuevaReserva = {
        id: Date.now(), // ID único basado en timestamp
        eventoId: eventoId,
        mesaId: mesaId,
        userEmail: userEmail,
        fechaReserva: new Date().toISOString(),
        // Información adicional para mostrar en el perfil
        eventoTitulo: evento.titulo,
        eventoFecha: evento.fecha,
        eventoHora: evento.hora,
        eventoImagen: evento.imagen,
        mesaNombre: mesa.nombre
    };

    // Obtener reservas existentes y agregar la nueva
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(nuevaReserva);

    // Guardar en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Mostrar confirmación y redireccionar
    alert(`¡Reserva confirmada! Has reservado la ${mesa.nombre} para el evento "${evento.titulo}".`);
    window.location.href = 'perfil.html';
}
