const { Router } = require('express');
const router = Router();
const userController = require('../Controllers/userController');

router.get('/users', userController.buscarTodos);

router.get('/user/:id', userController.buscar);
  
router.post('/user/', (userController.criar));
 
router.put('/user/:id', (userController.atualizar));
  
router.delete('/user/:id', (userController.deletar));
  
module.exports = router;
