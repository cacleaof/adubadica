const { Router } = require('express');
const router = Router();
const culturaController = require('../Controllers/culturaController');
const upload = require('../middleware/uploadMiddleware');

router.get('/culturas', culturaController.buscarTodos);

router.get('/cultura/:id', culturaController.buscar);
  
router.post('/cultura', (culturaController.criar));
 
router.put('/cultura/:id', (culturaController.atualizar));
  
router.delete('/cultura/:id', (culturaController.deletar));

// Novas rotas para PDF
router.post('/cultura-with-pdf', upload.single('pdf'), culturaController.criarComPDF);
router.get('/cultura/:id/download-pdf', culturaController.downloadPDF);
router.get('/cultura/:id/view-pdf', culturaController.visualizarPDF);
router.get('/pdfs', culturaController.listarPDFs);

module.exports = router;
