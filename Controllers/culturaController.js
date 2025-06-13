const culturaModel = require('../Models/culturaModel');

class culturaController {

  buscarTodos(req, res) {
    const listaculturas = culturaModel.buscarTodos();
  return listaculturas
  .then((culturas) => res.status(200).json(culturas))
  .catch((error) => res.status(400).json( error.message ))
  };
  buscar(req, res) {
    const { id } = req.params;
    const cultura = culturaModel.buscar(id);
  return cultura
  .then((culturas) => res.status(200).json(culturas))
  .catch((error) => res.status(400).json( error.message ))
  };

  criar(req, res) {
    const novocultura = req.body;
    const cultura = culturaModel.criar(novocultura);	
      cultura
      .then(culturaCriado => res.status(201).json(culturaCriado))
      .catch((error) => res.status(400).json( error.message ));
      };

  atualizar(req, res) {
    const { id } = req.params;
    const culturaAtualizado = req.body;
    const cultura = culturaModel.atualizar(culturaAtualizado, id);
    return cultura
      .then(resultculturaAtualizado => res.status(200).json(resultculturaAtualizado))
      .catch((error) => res.status(400).json( error.message ));
    };
    deletar(req, res) {
      const { id } = req.params;
      const cultura = culturaModel.deletar(id);
    return cultura
    .then((resultadoculturaDeletado) => res.status(200).json( resultadoculturaDeletado))
    .catch((error) => res.status(400).json(error.message))
    };
}
module.exports = new culturaController();
