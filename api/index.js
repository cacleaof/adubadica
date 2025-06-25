const express = require('express');
const cors = require('cors');
const router = require('../Routers/index');
const conexao = require('../Database/conexao');
const tabelas = require('../Database/criar_tabelas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

// Cache para inicialização do banco
let bancoInicializado = false;
let inicializacaoEmAndamento = false;

async function inicializarBanco() {
    if (bancoInicializado) return;
    
    if (inicializacaoEmAndamento) {
        // Aguarda a inicialização em andamento
        while (inicializacaoEmAndamento) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
    }
    
    inicializacaoEmAndamento = true;
    
    try {
        await tabelas.init(conexao);
        console.log('Banco de dados inicializado com sucesso!');
        bancoInicializado = true;
    } catch (erro) {
        console.error('Erro ao inicializar banco de dados:', erro);
        // Não marca como inicializado em caso de erro para permitir nova tentativa
    } finally {
        inicializacaoEmAndamento = false;
    }
}

// Middleware para inicializar o banco com timeout
app.use(async (req, res, next) => {
    try {
        // Timeout de 10 segundos para inicialização
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout na inicialização do banco')), 10000);
        });
        
        await Promise.race([inicializarBanco(), timeoutPromise]);
        next();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        // Continua mesmo com erro para não quebrar a aplicação
        next();
    }
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

// Handler específico para o Vercel
const handler = async (req, res) => {
    try {
        // Inicializa o banco rapidamente
        if (!bancoInicializado && !inicializacaoEmAndamento) {
            inicializacaoEmAndamento = true;
            try {
                await tabelas.init(conexao);
                bancoInicializado = true;
            } catch (erro) {
                console.error('Erro na inicialização:', erro);
            } finally {
                inicializacaoEmAndamento = false;
            }
        }
        
        // Processa a requisição
        return app(req, res);
    } catch (error) {
        console.error('Erro no handler:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Exporta tanto o app quanto o handler para compatibilidade
module.exports = app;
module.exports.handler = handler; 