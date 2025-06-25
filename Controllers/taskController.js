const taskModel = require('../Models/taskModel');

class taskController {
  async buscarTodos(req, res) {
    try {
      const tasks = await taskModel.buscarTodos();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro em buscarTodos:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const tasks = await taskModel.buscar(id);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro em buscar:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  async criar(req, res) {
    try {
      const novotask = req.body;
      const taskCriado = await taskModel.criar(novotask);
      res.status(201).json(taskCriado);
    } catch (error) {
      console.error('Erro em criar:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const taskAtualizado = req.body;
      const resulttaskAtualizado = await taskModel.atualizar(taskAtualizado, id);
      res.status(200).json(resulttaskAtualizado);
    } catch (error) {
      console.error('Erro em atualizar:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadotaskDeletado = await taskModel.deletar(id);
      res.status(200).json(resultadotaskDeletado);
    } catch (error) {
      console.error('Erro em deletar:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
}

module.exports = new taskController();
