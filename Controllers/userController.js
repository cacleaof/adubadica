const userModel = require('../Models/userModel');

class userController {
  async buscarTodos(req, res) {
    try {
      const users = await userModel.buscarTodos();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const users = await userModel.buscar(id);
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novouser = req.body;
      const userCriado = await userModel.criar(novouser);
      res.status(201).json(userCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const userAtualizado = req.body;
      const resultuserAtualizado = await userModel.atualizar(userAtualizado, id);
      res.status(200).json(resultuserAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadouserDeletado = await userModel.deletar(id);
      res.status(200).json(resultadouserDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

module.exports = new userController();
