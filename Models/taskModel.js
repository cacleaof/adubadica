const conexao = require('../Database/conexao');
    
class taskModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      console.error('Erro na query:', erro);
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM task WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM task ORDER BY timestamp DESC LIMIT 1000';
    return this.executarQuery(sql);
  }

  async criar(novotask) {
    const sql = "INSERT INTO task SET ?";
    const resultado = await this.executarQuery(sql, novotask);
    return { id: resultado.insertId, ...novotask };
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM task WHERE id = ?';
    const resultado = await this.executarQuery(sql, [id]);
    return { deleted: resultado.affectedRows > 0, id };
  }

  async atualizar(taskAtualizado, id) {
    const sql = 'UPDATE task SET ? WHERE id = ?';
    const resultado = await this.executarQuery(sql, [taskAtualizado, id]);
    return { updated: resultado.affectedRows > 0, id, ...taskAtualizado };
  }
}

module.exports = new taskModel();