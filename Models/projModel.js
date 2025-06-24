const conexao = require('../Database/conexao');
    
class projModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM proj WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM proj';
    return this.executarQuery(sql);
  }

  async criar(novoproj) {
    const sql = "INSERT INTO proj SET ?";
    return this.executarQuery(sql, novoproj);
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM proj WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(projAtualizado, id) {
    const sql = 'UPDATE proj SET ? WHERE id = ?';
    return this.executarQuery(sql, [projAtualizado, id]);
  }
}

module.exports = new projModel();