const conexao = require('../Database/conexao');
    
class taskModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM task WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM task';
    return this.executarQuery(sql);
  }

  async criar(novotask) {
    const sql = "INSERT INTO task SET ?";
    return this.executarQuery(sql, novotask);
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM task WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(taskAtualizado, id) {
    const sql = 'UPDATE task SET ? WHERE id = ?';
    return this.executarQuery(sql, [taskAtualizado, id]);
  }
}

module.exports = new taskModel();