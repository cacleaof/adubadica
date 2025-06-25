const express = require('express');
const cors = require('cors');
const router = require('../Routers/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

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