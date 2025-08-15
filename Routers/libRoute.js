const { Router } = require('express');
const router = Router();
const libController = require('../Controllers/libController');

router.get('/libs', libController.buscarTodos);

router.get('/lib/:id', libController.buscar);
  
router.post('/lib', (libController.criar));
 
router.put('/lib/:id', (libController.atualizar));
  
router.delete('/lib/:id', (libController.deletar));
  
module.exports = router;
