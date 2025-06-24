const culturaModel = require('../Models/culturaModel');

class culturaController {
  async buscarTodos(req, res) {
    try {
      const culturas = await culturaModel.buscarTodos();
      res.status(200).json(culturas);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const culturas = await culturaModel.buscar(id);
      res.status(200).json(culturas);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novocultura = req.body;
      const culturaCriado = await culturaModel.criar(novocultura);
      res.status(201).json(culturaCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const culturaAtualizado = req.body;
      const resultculturaAtualizado = await culturaModel.atualizar(culturaAtualizado, id);
      res.status(200).json(resultculturaAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadoculturaDeletado = await culturaModel.deletar(id);
      res.status(200).json(resultadoculturaDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

module.exports = new culturaController();
