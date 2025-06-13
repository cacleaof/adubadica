const userModel = require('../Models/userModel');

class userController {

  buscarTodos(req, res) {
    const listausers = userModel.buscarTodos();
  return listausers
  .then((users) => res.status(200).json(users))
  .catch((error) => res.status(400).json( error.message ))
  };
  buscar(req, res) {
    const { id } = req.params;
    const user = userModel.buscar(id);
  return user
  .then((users) => res.status(200).json(users))
  .catch((error) => res.status(400).json( error.message ))
  };

  criar(req, res) {
    const novouser = req.body;
    const user = userModel.criar(novouser);	
      user
      .then(userCriado => res.status(201).json(userCriado))
      .catch((error) => res.status(400).json( error.message ));
      };

  atualizar(req, res) {
    const { id } = req.params;
    const userAtualizado = req.body;
    const user = userModel.atualizar(userAtualizado, id);
    return user
      .then(resultuserAtualizado => res.status(200).json(resultuserAtualizado))
      .catch((error) => res.status(400).json( error.message ));
    };
    deletar(req, res) {
      const { id } = req.params;
      const user = userModel.deletar(id);
    return user
    .then((resultadouserDeletado) => res.status(200).json( resultadouserDeletado))
    .catch((error) => res.status(400).json(error.message))
    };
}
module.exports = new userController();
