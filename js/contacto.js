// Script para manejar el formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;

            // Validación simple
            if (!nombre || !email || !asunto || !mensaje) {
                alert('Por favor, completa todos los campos');
                return;
            }

            // En un entorno real, aquí se enviarían los datos a un servidor
            // Para este ejemplo, simulamos un envío exitoso
            simulateFormSubmission(nombre, email, asunto, mensaje);
        });
    }
});

// Simula el envío del formulario de contacto
function simulateFormSubmission(nombre, email, asunto, mensaje) {
    // Simular tiempo de procesamiento
    setTimeout(function() {
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');

        // Limpiar el formulario
        document.getElementById('contact-form').reset();
    }, 1000);
}
