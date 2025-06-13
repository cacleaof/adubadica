const taskModel = require('../Models/taskModel');

class taskController {

  buscarTodos(req, res) {
    const listatasks = taskModel.buscarTodos();
  return listatasks
  .then((tasks) => res.status(200).json(tasks))
  .catch((error) => res.status(400).json( error.message ))
  };
  buscar(req, res) {
    const { id } = req.params;
    const task = taskModel.buscar(id);
  return task
  .then((tasks) => res.status(200).json(tasks))
  .catch((error) => res.status(400).json( error.message ))
  };

  criar(req, res) {
    const novotask = req.body;
    const task = taskModel.criar(novotask);	
      task
      .then(taskCriado => res.status(201).json(taskCriado))
      .catch((error) => res.status(400).json( error.message ));
      };

  atualizar(req, res) {
    const { id } = req.params;
    const taskAtualizado = req.body;
    const task = taskModel.atualizar(taskAtualizado, id);
    return task
      .then(resulttaskAtualizado => res.status(200).json(resulttaskAtualizado))
      .catch((error) => res.status(400).json( error.message ));
    };
    deletar(req, res) {
      const { id } = req.params;
      const task = taskModel.deletar(id);
    return task
    .then((resultadotaskDeletado) => res.status(200).json( resultadotaskDeletado))
    .catch((error) => res.status(400).json(error.message))
    };
}
module.exports = new taskController();
