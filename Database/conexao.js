const mysql = require('mysql2/promise');

const conexao = mysql.createPool({
    host: 'mysql-caleao.alwaysdata.net',
    port: 3306,
    user: 'caleao',
    password: 'caleao428027',               
    database: 'caleao_controle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = conexao;
