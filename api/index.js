const express = require('express');
const cors = require('cors');
const router = require('../Routers/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de CORS mais específica
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

// Middleware para adicionar headers CORS manualmente se necessário
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

// Rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando corretamente!' });
});

// Rota de teste para verificar conexão com banco
app.get('/api/db-test', async (req, res) => {
    try {
        const conexao = require('../Database/conexao');
        const [rows] = await conexao.query("SELECT NOW() AS agora");
        res.status(200).json({ 
            message: 'Conexão com banco OK!',
            timestamp: rows[0].agora
        });
    } catch (err) {
        console.error("Erro MySQL:", err);
        res.status(500).json({ error: "Erro ao conectar ao banco de dados." });
    }
});

// Configura as rotas
router(app, express);

// Exporta a função serverless
module.exports = app; 