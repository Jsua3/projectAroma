const { Reservation, Table } = require('../models');

// Eventos predefinidos
const eventosPredefindos = [
  {
    id: 1,
    title: 'Noche de Jazz',
    description: 'Disfruta de una noche con lo mejor del jazz en vivo mientras disfrutas de tu café favorito.',
    date: '2025-06-15',
    time: '19:00:00',
    image: './img/eventos/jazz.jpg',
    capacity: 20,
    price: 5.00,
    isActive: true
  },
  {
    id: 2,
    title: 'Taller de Barismo',
    description: 'Aprende los secretos para preparar el café perfecto con nuestros expertos baristas.',
    date: '2025-06-20',
    time: '16:00:00',
    capacity: 15,
    price: 15.00,
    image: './img/eventos/barismo.jpg',
    isActive: true
  },
  {
    id: 3,
    title: 'Cata de Café de Especialidad',
    description: 'Explora los sabores y aromas de los mejores cafés de especialidad del mundo.',
    date: '2025-06-25',
    time: '17:00:00',
    capacity: 12,
    price: 10.00,
    image: './img/eventos/cata.jpg',
    isActive: true
  },
  {
    id: 4,
    title: 'Noche de Poesía',
    description: 'Tarde de lectura y recitales poéticos acompañados de la mejor selección de café y té.',
    date: '2025-07-05',
    time: '18:00:00',
    capacity: 25,
    price: 0.00,
    image: './img/eventos/poesia.jpg',
    isActive: true
  },
  {
    id: 5,
    title: 'Exposición de Arte Local',
    description: 'Exhibición de obras de artistas locales mientras disfrutas de nuestras especialidades.',
    date: '2025-07-12',
    time: '11:00:00',
    capacity: 30,
    price: 0.00,
    image: './img/eventos/arte.jpg',
    isActive: true
  },
  {
    id: 6,
    title: 'Club de Lectura',
    description: 'Únete a nuestro club mensual de lectura para discutir libros interesantes en un ambiente acogedor.',
    date: '2025-07-18',
    time: '17:00:00',
    capacity: 18,
    price: 0.00,
    image: './img/eventos/lectura.jpg',
    isActive: true
  }
];

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    // Devolver los eventos predefinidos
    res.json({
      success: true,
      data: { events: eventosPredefindos }
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener eventos', 
      error: error.message 
    });
  }
};

// Obtener un evento por ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el evento en la lista de eventos predefinidos
    const event = eventosPredefindos.find(e => e.id === parseInt(id));

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Evento no encontrado' 
      });
    }

    // Obtener todas las mesas
    const allTables = await Table.findAll({
      where: { isActive: true }
    });

    // Obtener mesas reservadas para este evento
    const reservedTables = await Reservation.findAll({
      where: {
        eventId: id,
        status: 'confirmed'
      },
      attributes: ['tableId']
    });

    const reservedTableIds = reservedTables.map(res => res.tableId);

    // Marcar las mesas como disponibles o reservadas
    const tables = allTables.map(table => ({
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      location: table.location,
      isReserved: reservedTableIds.includes(table.id)
    }));

    res.json({
      success: true,
      data: { 
        event,
        tables
      }
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener evento', 
      error: error.message 
    });
  }
};

// Ya no se implementan funciones de administración de eventos
// Los eventos ahora son estáticos y predefinidos
