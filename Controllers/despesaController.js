const despesaModel = require('../Models/despesaModel');

class despesaController {
  async buscarTodos(req, res) {
    try {
      const despesas = await despesaModel.buscarTodos();
      res.status(200).json(despesas);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const despesa = await despesaModel.buscar(id);
      res.status(200).json(despesa);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novodespesa = req.body;
      console.log('Dados recebidos no controller:', novodespesa);
      const despesaCriado = await despesaModel.criar(novodespesa);
      res.status(201).json(despesaCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const despesaAtualizado = req.body;
      const resultdespesaAtualizado = await despesaModel.atualizar(despesaAtualizado, id);
      res.status(200).json(resultdespesaAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadodespesaDeletado = await despesaModel.deletar(id);
      res.status(200).json(resultadodespesaDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

module.exports = new despesaController();
