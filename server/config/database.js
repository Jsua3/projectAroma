const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
let pool;

const connectToDatabase = async () => {
  try {
    pool = mysql.createPool(dbConfig);

    // Verificar conexión
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();

    return pool;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

// Función para ejecutar consultas SQL
const executeQuery = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    console.error('SQL:', sql);
    console.error('Parámetros:', params);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
  executeQuery,
  getPool: () => pool
};
