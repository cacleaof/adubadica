const { Router } = require('express');
const router = Router();
const projController = require('../Controllers/projController');
const upload = require('../middleware/uploadMiddleware');

router.get('/projs', projController.buscarTodos);

router.get('/proj/:id', projController.buscar);
  
router.post('/proj', (projController.criar));
 
router.put('/proj/:id', (projController.atualizar));
  
router.delete('/proj/:id', (projController.deletar));

// Novas rotas para dependências
router.get('/proj/:id/dependentes', projController.buscarDependentes);
router.get('/proj/:id/projeto-pai', projController.buscarProjetoPai);
router.get('/projs-com-dependencias', projController.buscarComDependencias);
router.get('/projs-raiz', projController.buscarProjetosRaiz);
router.get('/proj/:id/arvore-dependencias', projController.buscarArvoreDependencias);
router.post('/proj/:id/validar-dependencia', projController.validarDependenciaCircular);

// Novas rotas para PDF
router.post('/proj-with-pdf', upload.single('pdf'), projController.criarComPDF);
router.put('/proj/:id/with-pdf', upload.single('pdf'), projController.atualizarComPDF);
router.get('/proj/:id/download-pdf', projController.downloadPDF);
router.get('/proj/:id/view-pdf', projController.visualizarPDF);

module.exports = router;
