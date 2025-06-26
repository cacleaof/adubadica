const express = require('express');
const cors = require('cors');

const app = express();

// Configuração de CORS específica
const corsOptions = {
    origin: [
        'https://angion.vercel.app',
        'http://localhost:3000',
        'http://localhost:4200',
        'http://localhost:8080',
        'https://caleao.space'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware para adicionar headers CORS manualmente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://angion.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rota de teste para CORS
app.get('/test-cors', (req, res) => {
    res.status(200).json({ 
        message: 'CORS configurado corretamente!',
        origin: req.headers.origin,
        method: req.method,
        headers: req.headers
    });
});

// Rota para testar despesas com CORS
app.get('/despesas', (req, res) => {
    res.status(200).json({ 
        message: 'Endpoint de despesas funcionando com CORS!',
        data: []
    });
});

module.exports = app; 