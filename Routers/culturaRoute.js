const { Router } = require('express');
const router = Router();
const culturaController = require('../Controllers/culturaController');

router.get('/culturas', culturaController.buscarTodos);

router.get('/cultura/:id', culturaController.buscar);
  
router.post('/cultura', (culturaController.criar));
 
router.put('/cultura/:id', (culturaController.atualizar));
  
router.delete('/cultura/:id', (culturaController.deletar));
  
module.exports = router;
