const conexao = require('../Database/conexao');
    
class taskModel {
  async executarQuery(sql, params) {
    try {
      // Timeout de 8 segundos para queries
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na query do banco')), 8000);
      });
      
      const [resultados] = await Promise.race([
        conexao.query(sql, params),
        timeoutPromise
      ]);
      
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