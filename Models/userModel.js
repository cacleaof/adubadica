    const conexao = require('../Database/conexao');
    
class userModel {

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
    const sql = 'SELECT * FROM user WHERE id = ?';
    return this.executarQuery(sql, id);
  }
  buscarTodos() {
    const sql = 'SELECT * FROM user';
    return this.executarQuery(sql);
  }

  criar(novouser) {
  const sql = "INSERT INTO user SET ?";
  return this.executarQuery(sql, novouser);}
    
  deletar(id) {
    const sql = 'DELETE FROM user WHERE id = ?';
    return this.executarQuery(sql, id);}

  atualizar(userAtualizado, id) {
        const sql = 'UPDATE user SET ? WHERE id = ?';
        return this.executarQuery(sql, [userAtualizado, id])}
  }
    module.exports = new userModel();