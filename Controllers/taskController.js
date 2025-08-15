const taskModel = require('../Models/taskModel');
const fs = require('fs');
const path = require('path');

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
      console.log('Dados recebidos para criar task:', req.body);
      
      // Validação básica dos dados
      if (!req.body.nome) {
        return res.status(400).json({ 
          error: 'Nome da tarefa é obrigatório' 
        });
      }

      const novotask = req.body;
      const taskCriado = await taskModel.criar(novotask);
      
      console.log('Task criada com sucesso:', taskCriado);
      res.status(201).json(taskCriado);
    } catch (error) {
      console.error('Erro detalhado em criar task:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
      
      // Primeiro, buscar a tarefa para verificar se tem arquivo
      const tarefas = await taskModel.buscarComArquivo(id);
      
      if (tarefas && tarefas.length > 0) {
        const tarefa = tarefas[0];
        
        // Se a tarefa tem um arquivo na coluna grav, deletar o arquivo
        if (tarefa.grav) {
          const filePath = path.join(__dirname, '../assets/uploads', tarefa.grav);
          
          // Verificar se o arquivo existe antes de tentar deletar
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`✅ Arquivo deletado com sucesso: ${tarefa.grav}`);
            } catch (fileError) {
              console.error(`❌ Erro ao deletar arquivo ${tarefa.grav}:`, fileError);
              // Continuar com a exclusão da tarefa mesmo se o arquivo não puder ser deletado
            }
          } else {
            console.log(`⚠️ Arquivo não encontrado: ${tarefa.grav}`);
          }
        }
      }
      
      // Deletar a tarefa do banco de dados
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
