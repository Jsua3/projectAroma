/**
 * Script para administración de eventos
 */

// Variables para paginación
let paginaActual = 1;
let eventosPorPagina = 10;
let totalEventos = 0;
let totalPaginas = 0;
let eventosData = [];

/**
 * Cargar eventos para la página de administración
 */
async function cargarEventosAdmin() {
    const eventosTable = document.getElementById('eventos-list');
    if (!eventosTable) return;

    try {
        // Obtener eventos (todos, incluso inactivos)
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/events?all=true`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar eventos');
        }

        eventosData = data.data.events;
        totalEventos = eventosData.length;
        totalPaginas = Math.ceil(totalEventos / eventosPorPagina);

        // Mostrar eventos paginados
        mostrarEventosPaginados();

        // Configurar paginación
        configurarPaginacion();

        // Configurar búsqueda
        configurarBusqueda();

    } catch (error) {
        console.error('Error al cargar eventos para administración:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error al cargar los eventos',
            icon: 'error'
        });
    }
}

/**
 * Muestra los eventos paginados en la tabla
 */
function mostrarEventosPaginados(eventosFiltrados = null) {
    const eventosTable = document.getElementById('eventos-list');
    eventosTable.innerHTML = '';

    const eventos = eventosFiltrados || eventosData;

    // Calcular índices para la página actual
    const inicio = (paginaActual - 1) * eventosPorPagina;
    const fin = Math.min(inicio + eventosPorPagina, eventos.length);

    // Si no hay eventos
    if (eventos.length === 0) {
        eventosTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No hay eventos disponibles</td>
            </tr>
        `;
        return;
    }

    // Mostrar eventos para la página actual
    for (let i = inicio; i < fin; i++) {
        const evento = eventos[i];

        // Formatear fecha
        const fecha = new Date(evento.date);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');

        // Crear fila para el evento
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.id}</td>
            <td>${evento.title}</td>
            <td>${fechaFormateada}</td>
            <td>${evento.time}</td>
            <td>${evento.capacity}</td>
            <td>${evento.price ? '€' + parseFloat(evento.price).toFixed(2) : 'Gratis'}</td>
            <td>
                <span class="badge ${evento.isActive ? 'badge-success' : 'badge-inactive'}">
                    ${evento.isActive ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="actions-cell">
                <a href="admin-evento-form.html?id=${evento.id}" class="btn-action btn-edit" title="Editar">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn-action btn-delete" data-id="${evento.id}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                <a href="eventos.html?id=${evento.id}" class="btn-action btn-view" title="Ver">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        `;

        // Añadir event listener para eliminar
        const btnEliminar = row.querySelector('.btn-delete');
        btnEliminar.addEventListener('click', function() {
            const eventoId = this.getAttribute('data-id');
            confirmarEliminarEvento(eventoId);
        });

        eventosTable.appendChild(row);
    }
}

/**
 * Configura la paginación
 */
function configurarPaginacion() {
    const paginacion = document.getElementById('pagination');
    if (!paginacion) return;

    paginacion.innerHTML = '';

    // Si hay pocas páginas, no mostrar paginación
    if (totalPaginas <= 1) return;

    // Botón anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarEventosPaginados();
            configurarPaginacion();
        }
    });
    paginacion.appendChild(btnAnterior);

    // Botones de páginas
    const maxPaginas = 5; // Máximo de botones de página a mostrar
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);

    // Ajustar el inicio si estamos cerca del final
    if (fin - inicio + 1 < maxPaginas) {
        inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.classList.toggle('active', i === paginaActual);
        btnPagina.addEventListener('click', () => {
            paginaActual = i;
            mostrarEventosPaginados();
            configurarPaginacion();
        });
        paginacion.appendChild(btnPagina);
    }

    // Botón siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.addEventListener('click', () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarEventosPaginados();
            configurarPaginacion();
        }
    });
    paginacion.appendChild(btnSiguiente);
}

/**
 * Configura la búsqueda de eventos
 */
function configurarBusqueda() {
    const searchInput = document.getElementById('search-eventos');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const busqueda = this.value.toLowerCase().trim();

        if (busqueda === '') {
            // Mostrar todos los eventos
            paginaActual = 1;
            mostrarEventosPaginados();
            configurarPaginacion();
            return;
        }

        // Filtrar eventos que coincidan con la búsqueda
        const eventosFiltrados = eventosData.filter(evento => 
            evento.title.toLowerCase().includes(busqueda) ||
            evento.description.toLowerCase().includes(busqueda)
        );

        // Actualizar paginación para eventos filtrados
        totalEventos = eventosFiltrados.length;
        totalPaginas = Math.ceil(totalEventos / eventosPorPagina);
        paginaActual = 1;

        // Mostrar eventos filtrados
        mostrarEventosPaginados(eventosFiltrados);
        configurarPaginacion();
    });
}

/**
 * Muestra diálogo de confirmación para eliminar un evento
 * @param {number} id - ID del evento a eliminar
 */
async function confirmarEliminarEvento(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        await eliminarEvento(id);
        cargarEventosAdmin(); // Recargar la lista después de eliminar
    }
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

        return true;
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        await Swal.fire({
            title: 'Error',
            text: error.message || 'Error al eliminar el evento',
            icon: 'error'
        });
        return false;
    }
}
