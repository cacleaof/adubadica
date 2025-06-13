    const conexao = require('../Database/conexao');
    
class culturaModel {

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
    const sql = 'SELECT * FROM cultura WHERE id = ?';
    return this.executarQuery(sql, id);
  }
  buscarTodos() {
    const sql = 'SELECT * FROM cultura';
    return this.executarQuery(sql);
  }

  criar(novocultura) {
  const sql = "INSERT INTO cultura SET ?";
  return this.executarQuery(sql, novocultura);}
    
  deletar(id) {
    const sql = 'DELETE FROM cultura WHERE id = ?';
    return this.executarQuery(sql, id);}

  atualizar(culturaAtualizado, id) {
        const sql = 'UPDATE cultura SET ? WHERE id = ?';
        return this.executarQuery(sql, [culturaAtualizado, id])}
  }
    module.exports = new culturaModel();