#!/bin/bash

echo "Inicializando base de datos desde script SQL..."

# Solicitar credenciales
read -p "Usuario de MySQL (usualmente root): " DB_USER
read -sp "Contraseña de MySQL: " DB_PASSWORD
echo ""

# Ejecutar script SQL
mysql -u "$DB_USER" -p"$DB_PASSWORD" < db-init.sql

if [ $? -ne 0 ]; then
    echo "Error al ejecutar el script SQL"
    exit 1
fi

echo "Base de datos inicializada correctamente."
echo ""
echo "Ahora puedes iniciar el servidor con 'npm start'"
