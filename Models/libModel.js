const conexao = require('../Database/conexao');
    
class libModel {
  async executarQuery(sql, params) {
    try {
      console.log('Executando query:', sql, 'com parâmetros:', params);
      const [resultados] = await conexao.query(sql, params);
      console.log('Resultado da query:', resultados);
      return resultados;
    } catch (erro) {
      console.error('Erro detalhado na query:', erro);
      console.error('SQL:', sql);
      console.error('Parâmetros:', params);
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM lib WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM lib ORDER BY timestamp DESC LIMIT 1000';
    return this.executarQuery(sql);
  }

  async criar(novolib) {
    try {
      console.log('Criando lib com dados:', novolib);
      
      // Garantir que os campos obrigatórios existam
      const libData = {
        nome: novolib.nome || '',
        descricao: novolib.descricao || '',
        imagem: novolib.imagem || '',
        file: novolib.file || '',
        uid: novolib.uid || null,
      };

      const sql = "INSERT INTO lib SET ?";
      const resultado = await this.executarQuery(sql, libData);
      
      console.log('lib criada com ID:', resultado.insertId);
      return { id: resultado.insertId, ...libData };
    } catch (error) {
      console.error('Erro ao criar lib:', error);
      throw error;
    }
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM lib WHERE id = ?';
    const resultado = await this.executarQuery(sql, [id]);
    return { deleted: resultado.affectedRows > 0, id };
  }

  async atualizar(libAtualizado, id) {
    const sql = 'UPDATE lib SET ? WHERE id = ?';
    const resultado = await this.executarQuery(sql, [libAtualizado, id]);
    return { updated: resultado.affectedRows > 0, id, ...libAtualizado };
  }

  async buscarComArquivo(id) {
    const sql = 'SELECT *, grav FROM lib WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }
}

module.exports = new libModel();