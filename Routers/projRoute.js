const { Router } = require('express');
const router = Router();
const projController = require('../Controllers/projController');

router.get('/projs', projController.buscarTodos);

router.get('/proj/:id', projController.buscar);
  
router.post('/proj', (projController.criar));
 
router.put('/proj/:id', (projController.atualizar));
  
router.delete('/proj/:id', (projController.deletar));
  
module.exports = router;
