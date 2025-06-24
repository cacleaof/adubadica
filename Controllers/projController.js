const projModel = require('../Models/projModel');

class projController {
  async buscarTodos(req, res) {
    try {
      const projs = await projModel.buscarTodos();
      res.status(200).json(projs);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const projs = await projModel.buscar(id);
      res.status(200).json(projs);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novoproj = req.body;
      const projCriado = await projModel.criar(novoproj);
      res.status(201).json(projCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const projAtualizado = req.body;
      const resultprojAtualizado = await projModel.atualizar(projAtualizado, id);
      res.status(200).json(resultprojAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadoprojDeletado = await projModel.deletar(id);
      res.status(200).json(resultadoprojDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

module.exports = new projController();
