/**
 * Aroma Café - Sistema de Gestión de Eventos
 * 
 * Este archivo contiene la lógica para mostrar los eventos predeterminados
 * en la página de eventos del café.
 */

// Array con los eventos predeterminados
const eventos = [
    {
        id: 1,
        titulo: 'Noche de Jazz',
        descripcion: 'Disfruta de una noche con lo mejor del jazz en vivo mientras disfrutas de tu café favorito.',
        fecha: '15 de junio, 2025',
        hora: '19:00 - 21:00',
        imagen: './img/eventos/jazz.jpg',
        capacidad: 20
    },
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

// Función que se ejecuta cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Cargar y mostrar los eventos
    const eventosContainer = document.getElementById('eventos-container');
    if (eventosContainer) {
        cargarEventos();
    }

    // Configurar filtros de eventos si existen
    configurarFiltrosEventos();
});

/**
 * Carga y muestra todos los eventos en el contenedor
 */
function cargarEventos() {
    const eventosContainer = document.getElementById('eventos-container');
    if (!eventosContainer) return;

    // Limpiar el contenedor
    eventosContainer.innerHTML = '';

    // Iterar sobre cada evento y crear su elemento HTML
    eventos.forEach(evento => {
        const eventoElement = crearElementoEvento(evento);
        eventosContainer.appendChild(eventoElement);
    });
}

/**
 * Crea un elemento DOM para un evento
 * @param {Object} evento - Datos del evento
 * @returns {HTMLElement} - Elemento DOM del evento
 */
function crearElementoEvento(evento) {
    // Crear elemento del evento
    const eventoElement = document.createElement('div');
    eventoElement.className = 'evento-card';

    // Determinar categoría para filtrado
    let categoria = 'otros';
    if (evento.titulo.toLowerCase().includes('taller') || evento.titulo.toLowerCase().includes('cata')) {
        categoria = 'talleres';
    } else if (evento.titulo.toLowerCase().includes('jazz') || evento.titulo.toLowerCase().includes('música') || evento.titulo.toLowerCase().includes('musica')) {
        categoria = 'musica';
    } else if (evento.titulo.toLowerCase().includes('arte') || evento.titulo.toLowerCase().includes('poesía') || evento.titulo.toLowerCase().includes('lectura') || evento.titulo.toLowerCase().includes('poesia')) {
        categoria = 'arte';
    }

    // Asignar atributos para filtrado
    eventoElement.setAttribute('data-categoria', categoria);
    eventoElement.setAttribute('data-id', evento.id);

    // Contenido HTML del evento
    eventoElement.innerHTML = `
        <div class="evento-imagen">
            <img src="${evento.imagen}" alt="${evento.titulo}">
        </div>
        <div class="evento-info">
            <h3>${evento.titulo}</h3>
            <p class="evento-fecha"><i class="far fa-calendar-alt"></i> ${evento.fecha}</p>
            <p class="evento-hora"><i class="far fa-clock"></i> ${evento.hora}</p>
            <p class="evento-capacidad"><i class="fas fa-users"></i> Capacidad: ${evento.capacidad} personas</p>
            <p class="evento-descripcion">${evento.descripcion}</p>
            <div class="evento-actions">
                <button class="btn-small btn-reservar" data-id="${evento.id}">Reservar</button>
            </div>
        </div>
    `;

    // Añadir event listener al botón de reserva
    const btnReservar = eventoElement.querySelector('.btn-reservar');
    btnReservar.addEventListener('click', function() {
        Swal.fire({
            title: 'Reserva',
            text: `Has seleccionado el evento "${evento.titulo}". Pronto estará disponible la funcionalidad de reserva.`,
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
    });

    return eventoElement;
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
 * Filtra los eventos mostrados según la categoría seleccionada
 * @param {string} filtro - Categoría a filtrar ('todos', 'talleres', 'musica', 'arte')
 */
function filtrarEventos(filtro) {
    const eventosCards = document.querySelectorAll('.evento-card');

    eventosCards.forEach(eventoCard => {
        const categoria = eventoCard.getAttribute('data-categoria');

        if (filtro === 'todos' || filtro === categoria) {
            eventoCard.style.display = 'block';
        } else {
            eventoCard.style.display = 'none';
        }
    });
}

/**
 * Carga eventos destacados para la página principal
 */
function cargarEventosDestacados() {
    const eventosDestacados = document.getElementById('eventos-destacados');
    if (!eventosDestacados) return;

    // Limpiar contenedor
    eventosDestacados.innerHTML = '';

    // Mostrar solo los primeros 2 eventos
    eventos.slice(0, 2).forEach(evento => {
        const eventoHTML = `
            <div class="evento-card">
                <img src="${evento.imagen}" alt="${evento.titulo}">
                <h3>${evento.titulo}</h3>
                <p class="evento-fecha"><i class="far fa-calendar-alt"></i> ${evento.fecha}</p>
                <p>${evento.descripcion.substring(0, 100)}...</p>
                <a href="eventos.html" class="btn-small">Ver más</a>
            </div>
        `;

        eventosDestacados.innerHTML += eventoHTML;
    });
}
