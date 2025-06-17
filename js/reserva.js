// Función para crear una nueva reserva
async function crearReserva(eventoId) {
    const mesaId = localStorage.getItem('mesaSeleccionada');

    if (!mesaId) {
        mostrarAlerta('Error', 'Por favor, selecciona una mesa primero', 'error');
        return false;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            mostrarAlerta('Error', 'Debes iniciar sesión para reservar', 'error');
            window.location.href = 'login.html';
            return false;
        }

        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                eventId: parseInt(eventoId),
                tableId: parseInt(mesaId)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear reserva');
        }

        // Limpiar la mesa seleccionada después de reservar exitosamente
        localStorage.removeItem('mesaSeleccionada');

        return data;
    } catch (error) {
        console.error('Error al crear reserva:', error);
        mostrarAlerta('Error', error.message, 'error');
        return false;
    }
}

// Función para mostrar alertas
function mostrarAlerta(titulo, mensaje, tipo) {
    // Implementar según el sistema de alertas que uses (SweetAlert, etc)
    alert(`${titulo}: ${mensaje}`);
}
