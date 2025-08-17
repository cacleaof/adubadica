const conexao = require('../Database/conexao');
    
class taskModel {
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
    const sql = 'SELECT * FROM task WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM task ORDER BY timestamp DESC LIMIT 1000';
    return this.executarQuery(sql);
  }

  async criar(novotask) {
    try {
      console.log('Criando task com dados:', novotask);
      // Garantir que os campos obrigatórios existam
      const taskData = {
        nome: novotask.nome || '',
        descricao: novotask.descricao || '',
        tipo: novotask.tipo || '',
        uid: novotask.uid || null,
        proj: novotask.proj || '',
        data: novotask.data || null,
        status: novotask.status || 'pendente',
        prioridade: novotask.prioridade || 1,
        grav: novotask.grav || null
      };

      const sql = "INSERT INTO task SET ?";
      const resultado = await this.executarQuery(sql, taskData);
      
      console.log('Task criada com ID:', resultado.insertId);
      return { id: resultado.insertId, ...taskData };
     
    } catch (error) {
      console.error('Erro ao criar task:', error);
      throw error;
    }
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

  async buscarComArquivo(id) {
    const sql = 'SELECT *, grav FROM task WHERE id = ?';
    return this.executarQuery(sql, [id]);
  }

  // Buscar tarefa por arquivo de áudio
  async buscarPorArquivo(audioFile) {
    const sql = 'SELECT * FROM task WHERE grav = ?';
    return this.executarQuery(sql, ["/assets/audio/"+audioFile]);
  }

  // Atualizar tarefa com texto transcrito
  async atualizarTexto(id, textFileName, transcription) {
    const sql = 'UPDATE task SET texto = ?, texto_arquivo = ? WHERE id = ?';
    const resultado = await this.executarQuery(sql, [transcription, textFileName, id]);
    return { updated: resultado.affectedRows > 0, id };
  }
}

module.exports = new taskModel();