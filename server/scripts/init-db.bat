@echo off
echo Inicializando base de datos desde script SQL...

REM Solicitar credenciales
set /p DB_USER=Usuario de MySQL (usualmente root): 
set /p DB_PASSWORD=Contraseña de MySQL: 

REM Ejecutar script SQL
mysql -u %DB_USER% -p%DB_PASSWORD% < db-init.sql

IF %ERRORLEVEL% NEQ 0 (
    echo Error al ejecutar el script SQL
    exit /b %ERRORLEVEL%
)

echo Base de datos inicializada correctamente.
echo.
echo Ahora puedes iniciar el servidor con 'npm start'
pause
