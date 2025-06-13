    const conexao = require('../Database/conexao');
    
class taskModel {

  executarQuery(sql, params) {
    return new Promise((resolve, reject) => {
      conexao.query(sql, params, (erro, resultados) => {
        if (erro) {
          console.log("Deu erro no executarQuery"+erro);
          return reject(erro);
        }
        return resolve(resultados);
      });
    });
  }
   buscar(id) {
    const sql = 'SELECT * FROM task WHERE id = ?';
    return this.executarQuery(sql, id);
  }
  buscarTodos() {
    const sql = 'SELECT * FROM task';
    return this.executarQuery(sql);
  }

  criar(novotask) {
  const sql = "INSERT INTO task SET ?";
  return this.executarQuery(sql, novotask);}
    
  deletar(id) {
    const sql = 'DELETE FROM task WHERE id = ?';
    return this.executarQuery(sql, id);}

  atualizar(taskAtualizado, id) {
        const sql = 'UPDATE task SET ? WHERE id = ?';
        return this.executarQuery(sql, [taskAtualizado, id])}
  }
    module.exports = new taskModel();