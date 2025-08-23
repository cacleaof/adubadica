const conexao = require('../Database/conexao');
    
class contaModel {
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
    const sql = 'SELECT * FROM conta WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM conta ORDER BY timestamp DESC LIMIT 1000';
    return this.executarQuery(sql);
  }

  async criar(novaconta) {
    try {
      console.log('Criando conta com dados:', novaconta);
      
      // Garantir que os campos obrigatórios existam
      const contaData = {
        nome: novaconta.nome || '',
        descricao: novaconta.descricao || '',
        imagem: novaconta.imagem || '',
        file: novaconta.file || '',
        uid: novaconta.uid || null,
      };

      const sql = "INSERT INTO conta SET ?";
      const resultado = await this.executarQuery(sql, contaData);
      
      console.log('conta criada com ID:', resultado.insertId);
      return { id: resultado.insertId, ...contaData };
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM conta WHERE id = ?';
    const resultado = await this.executarQuery(sql, [id]);
    return { deleted: resultado.affectedRows > 0, id };
  }

  async atualizar(contaAtualizado, id) {
    const sql = 'UPDATE conta SET ? WHERE id = ?';
    const resultado = await this.executarQuery(sql, [contaAtualizado, id]);
    return { updated: resultado.affectedRows > 0, id, ...contaAtualizado };
  }

  async buscarComArquivo(id) {
    const sql = 'SELECT *, grav FROM conta WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }
}

module.exports = new contaModel();