const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({origin: '*'}));

// Teste da tabela task
app.get('/api/test-task', async (req, res) => {
    try {
        const conexao = require('../Database/conexao');
        
        // Verifica se a tabela existe
        const [tables] = await conexao.query("SHOW TABLES LIKE 'task'");
        
        if (tables.length === 0) {
            return res.status(404).json({ 
                error: "Tabela 'task' não encontrada",
                timestamp: new Date().toISOString()
            });
        }
        
        // Conta registros
        const [count] = await conexao.query("SELECT COUNT(*) as total FROM task");
        
        // Busca alguns registros
        const [rows] = await conexao.query("SELECT * FROM task LIMIT 5");
        
        res.status(200).json({ 
            message: 'Tabela task encontrada!',
            total: count[0].total,
            sample: rows,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("Erro ao testar tabela task:", err);
        res.status(500).json({ 
            error: "Erro ao acessar tabela task",
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Teste da tabela proj
app.get('/api/test-proj', async (req, res) => {
    try {
        const conexao = require('../Database/conexao');
        
        // Verifica se a tabela existe
        const [tables] = await conexao.query("SHOW TABLES LIKE 'proj'");
        
        if (tables.length === 0) {
            return res.status(404).json({ 
                error: "Tabela 'proj' não encontrada",
                timestamp: new Date().toISOString()
            });
        }
        
        // Conta registros
        const [count] = await conexao.query("SELECT COUNT(*) as total FROM proj");
        
        // Busca alguns registros
        const [rows] = await conexao.query("SELECT * FROM proj LIMIT 5");
        
        res.status(200).json({ 
            message: 'Tabela proj encontrada!',
            total: count[0].total,
            sample: rows,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("Erro ao testar tabela proj:", err);
        res.status(500).json({ 
            error: "Erro ao acessar tabela proj",
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = app; 