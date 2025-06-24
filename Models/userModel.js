const conexao = require('../Database/conexao');
    
class userModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM user WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM user';
    return this.executarQuery(sql);
  }

  async criar(novouser) {
    const sql = "INSERT INTO user SET ?";
    return this.executarQuery(sql, novouser);
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM user WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(userAtualizado, id) {
    const sql = 'UPDATE user SET ? WHERE id = ?';
    return this.executarQuery(sql, [userAtualizado, id]);
  }
}

module.exports = new userModel();