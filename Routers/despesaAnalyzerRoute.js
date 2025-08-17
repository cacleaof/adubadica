const { Router } = require('express');
const router = Router();
const despesaAnalyzerController = require('../Controllers/despesaAnalyzerController');

// Rota para análise geral de despesas
router.post('/analisar', despesaAnalyzerController.analisarDespesas);

// Rota para gerar código de gráfico específico
router.post('/gerar-grafico', despesaAnalyzerController.gerarGrafico);

// Rota para verificar status do serviço
router.get('/status', despesaAnalyzerController.getStatus);

module.exports = router;
