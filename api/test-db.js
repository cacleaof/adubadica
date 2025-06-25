const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({origin: '*'}));

// Teste simples de conexão
app.get('/api/simple-test', (req, res) => {
    res.status(200).json({ 
        message: 'API funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Teste de conexão com banco
app.get('/api/db-simple', async (req, res) => {
    try {
        const conexao = require('../Database/conexao');
        
        // Timeout de 5 segundos
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout na conexão')), 5000);
        });
        
        const [rows] = await Promise.race([
            conexao.query("SELECT 1 as test"),
            timeoutPromise
        ]);
        
        res.status(200).json({ 
            message: 'Conexão com banco OK!',
            test: rows[0].test,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("Erro MySQL:", err);
        res.status(500).json({ 
            error: "Erro ao conectar ao banco de dados.",
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = app; 