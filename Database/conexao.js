const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'caleao-controle.mysql.uhserver.com',
    //host: '127.0.0.1',
    port: 3306,
    user: 'caleao',
    //user: 'root',
    password: process.env.PASSWORD,
    //password: 'root',              
    database: 'caleao_controle',
    //database: 'adubadica',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    acquireTimeout: 10000,
    timeout: 10000,
    reconnect: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Cache para verificar se já testamos a conexão
let connectionTested = false;

// Teste de conexão otimizado
async function testConnection() {
    if (!connectionTested) {
        try {
            const connection = await pool.getConnection();
            console.log('Conexão com banco estabelecida');
            connection.release();
            connectionTested = true;
        } catch (err) {
            console.error('Erro ao conectar com banco:', err);
            connectionTested = true; // Evita tentativas infinitas
        }
    }
}

// Testa conexão apenas uma vez
testConnection();

// Exporta o pool para uso local
module.exports = pool;

// Exporta a função para o Vercel
module.exports.vercel = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS agora");
    res.statusCode = 200;
    res.end(`Data e hora do MySQL: ${rows[0].agora}`);
  } catch (err) {
    console.error("Erro MySQL:", err);
    res.statusCode = 500;
    res.end("Erro ao conectar ao banco de dados.");
  }
};