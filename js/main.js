// Script principal para funcionalidades generales

document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si es la primera visita
    if (!localStorage.getItem('primeraVisita')) {
        // Inicializar datos de muestra
        inicializarDatosMuestra();
        localStorage.setItem('primeraVisita', 'true');
    }
});

// Función para inicializar datos de muestra
function inicializarDatosMuestra() {
    // Crear usuario de prueba si no existe
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        users.push({
            nombre: 'Usuario Demo',
            email: 'demo@example.com',
            password: 'demo123'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Asegurarse de que existan los eventos y mesas
    const eventos = JSON.parse(localStorage.getItem('eventos'));
    if (!eventos) {
        const eventosData = [
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
        localStorage.setItem('eventos', JSON.stringify(eventosData));
    }

    const mesas = JSON.parse(localStorage.getItem('mesas'));
    if (!mesas) {
        const mesasData = [
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
        localStorage.setItem('mesas', JSON.stringify(mesasData));
    }

    // Inicializar array de reservas vacío si no existe
    if (!localStorage.getItem('reservas')) {
        localStorage.setItem('reservas', JSON.stringify([]));
    }
}
