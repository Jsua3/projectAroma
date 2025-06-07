// Script para gestionar los eventos

// Datos de muestra para los eventos
const eventos = [
    {
        id: 1,
        titulo: 'Noche de Jazz',
        descripcion: 'Disfruta de una noche con lo mejor del jazz en vivo mientras disfrutas de tu café favorito.',
        fecha: '15 de junio, 2025',
        hora: '19:00 - 22:00',
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
function cargarEventos() {
    const eventosContainer = document.getElementById('eventos-container');
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    // Limpiar el contenedor
    eventosContainer.innerHTML = '';

    // Crear y agregar cada evento al contenedor
    eventos.forEach(evento => {
        const eventoElement = crearElementoEvento(evento);
        eventosContainer.appendChild(eventoElement);
    });
}

// Función para crear el elemento HTML de un evento
function crearElementoEvento(evento) {
    const eventoDiv = document.createElement('div');
    eventoDiv.className = 'evento-item';

    // Verificar si el usuario ya está registrado en este evento
    const userEmail = getCurrentUserEmail();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const yaRegistrado = reservas.some(r => r.eventoId === evento.id && r.userEmail === userEmail);

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
                alert('Debes iniciar sesión para registrarte en un evento');
                window.location.href = 'login.html';
            }
        });
    }

    return eventoDiv;
}
