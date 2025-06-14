const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'caleao-controle.mysql.uhserver.com',
    port: 3306,
    user: 'caleao',
    password: 'aduba@832',               
    database: 'caleao_controle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

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