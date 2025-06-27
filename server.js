const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const router = require('./Routers/index');
const conexao = require('./Database/conexao');
const tabelas = require('./Database/criar_tabelas');
const dados = require('./Database/migrar_dados');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de CORS mais específica
const corsOptions = {
    origin: [
        'https://angion.vercel.app',
        'http://localhost:3000',
        'http://localhost:4200',
        'http://localhost:8080',
        'https://caleao.space',
        'http://200.98.64.202'
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
        // Timeout de 15 segundos para todas as requisições
        req.setTimeout(15000);
        res.setTimeout(15000);
        next();
    }
});

// Inicializa as tabelas e dados de forma assíncrona
async function inicializarBanco() {
    try {
        await tabelas.init(conexao);
        //await dados.init(conexao);
        console.log('Banco de dados inicializado com sucesso!');
    } catch (erro) {
        console.error('Erro ao inicializar banco de dados:', erro);
    }
}

inicializarBanco();

router(app, express);

app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, (error) => {
    if(error) {
        console.error(`Error starting server: ${error}`);
    } else {
        console.log(`Server is running on http://localhost:${port}`);   
    }
});
