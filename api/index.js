const express = require('express');
const cors = require('cors');
const router = require('../Routers/index');
const conexao = require('../Database/conexao');
const tabelas = require('../Database/criar_tabelas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

// Inicializa as tabelas apenas uma vez
let bancoInicializado = false;
async function inicializarBanco() {
    if (!bancoInicializado) {
        try {
            await tabelas.init(conexao);
            console.log('Banco de dados inicializado com sucesso!');
            bancoInicializado = true;
        } catch (erro) {
            console.error('Erro ao inicializar banco de dados:', erro);
        }
    }
}

// Middleware para inicializar o banco
app.use(async (req, res, next) => {
    await inicializarBanco();
    next();
});

router(app, express);

// Rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando corretamente!' });
});

// Rota de teste para verificar conexão com banco
app.get('/api/db-test', async (req, res) => {
    try {
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

// Exporta a função serverless
module.exports = app; 