const conexao = require('../Database/conexao');
    
class culturaModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM cultura WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM cultura';
    return this.executarQuery(sql);
  }

  async criar(novocultura) {
    const sql = "INSERT INTO cultura SET ?";
    return this.executarQuery(sql, novocultura);
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM cultura WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(culturaAtualizado, id) {
    const sql = 'UPDATE cultura SET ? WHERE id = ?';
    return this.executarQuery(sql, [culturaAtualizado, id]);
  }
}

module.exports = new culturaModel();