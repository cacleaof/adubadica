const { Router } = require('express');
const router = Router();
const taskController = require('../Controllers/taskController');

router.get('/tasks', taskController.buscarTodos);

router.get('/task/:id', taskController.buscar);
  
router.post('/task', (taskController.criar));
 
router.put('/task/:id', (taskController.atualizar));
  
router.delete('/task/:id', (taskController.deletar));
  
module.exports = router;
