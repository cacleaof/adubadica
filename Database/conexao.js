const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'mysql-caleao.alwaysdata.net',
    port: 3306,
    user: 'caleao',
    password: 'caleao428027',               
    database: 'caleao_controle'
});

module.exports = conexao;
