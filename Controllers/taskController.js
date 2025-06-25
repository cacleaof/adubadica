const taskModel = require('../Models/taskModel');

class taskController {
  async buscarTodos(req, res) {
    try {
      // Timeout de 15 segundos para a consulta
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na consulta')), 15000);
      });
      
      const tasks = await Promise.race([
        taskModel.buscarTodos(),
        timeoutPromise
      ]);
      
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
      
      // Timeout de 10 segundos para a consulta
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na consulta')), 10000);
      });
      
      const tasks = await Promise.race([
        taskModel.buscar(id),
        timeoutPromise
      ]);
      
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
      
      // Timeout de 10 segundos para a inserção
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na criação')), 10000);
      });
      
      const taskCriado = await Promise.race([
        taskModel.criar(novotask),
        timeoutPromise
      ]);
      
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
      
      // Timeout de 10 segundos para a atualização
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na atualização')), 10000);
      });
      
      const resulttaskAtualizado = await Promise.race([
        taskModel.atualizar(taskAtualizado, id),
        timeoutPromise
      ]);
      
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
      
      // Timeout de 10 segundos para a exclusão
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na exclusão')), 10000);
      });
      
      const resultadotaskDeletado = await Promise.race([
        taskModel.deletar(id),
        timeoutPromise
      ]);
      
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
