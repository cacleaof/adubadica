const { Router } = require('express');
const router = Router();
const audioController = require('../Controllers/audioController');

// Iniciar processamento de áudio
router.post('/audio/iniciar', audioController.iniciarProcessamento);

// Processar arquivo específico
router.post('/audio/processar/:filename', audioController.processarArquivo);

// Listar arquivos de áudio
router.get('/audio/arquivos', audioController.listarArquivos);

// Obter status da fila
router.get('/audio/status', audioController.obterStatus);

// Limpar arquivos processados
router.delete('/audio/limpar', audioController.limparProcessados);

// Baixar arquivo de texto
router.get('/audio/texto/:filename', audioController.baixarTexto);

module.exports = router;


// Baixar arquivo de texto
router.get('/audio/texto/:filename', audioController.baixarTexto);

module.exports = router;
