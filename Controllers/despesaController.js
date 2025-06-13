const despesaModel = require('../Models/despesaModel');

class despesaController {

  buscarTodos(req, res) {
    const listadespesas = despesaModel.buscarTodos();
  return listadespesas
  .then((despesas) => res.status(200).json(despesas))
  .catch((error) => res.status(400).json( error.message ))
  };
  buscar(req, res) {
    const { id } = req.params;
    const despesa = despesaModel.buscar(id);
  return despesa
  .then((despesas) => res.status(200).json(despesas))
  .catch((error) => res.status(400).json( error.message ))
  };

  criar(req, res) {
      const novodespesa = req.body;
      console.log(novodespesa);
    const despesa = despesaModel.criar(novodespesa);	
      despesa
      .then(despesaCriado => res.status(201).json(despesaCriado))
      .catch((error) => res.status(400).json( error.message ));
      };

  atualizar(req, res) {
    const { id } = req.params;
    const despesaAtualizado = req.body;
    const despesa = despesaModel.atualizar(despesaAtualizado, id);
    return despesa
      .then(resultdespesaAtualizado => res.status(200).json(resultdespesaAtualizado))
      .catch((error) => res.status(400).json( error.message ));
    };
    deletar(req, res) {
      const { id } = req.params;
      const despesa = despesaModel.deletar(id);
    return despesa
    .then((resultadodespesaDeletado) => res.status(200).json( resultadodespesaDeletado))
    .catch((error) => res.status(400).json(error.message))
    };
}
module.exports = new despesaController();
