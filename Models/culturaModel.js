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
    try {
      console.log('📝 Modelo - Dados recebidos para criar cultura:', novocultura);
      
      // Validação básica
      if (!novocultura) {
        throw new Error('Dados da cultura são obrigatórios');
      }

      if (!novocultura.nome) {
        throw new Error('Nome da cultura é obrigatório');
      }

      // Formatar dados para inserção
      const culturaFormatada = {
        nome: novocultura.nome.trim(),
        adubatipo: novocultura.adubatipo || '',
        tipo: novocultura.tipo || '',
        N: parseFloat(novocultura.N) || 0,
        P: parseFloat(novocultura.P) || 0,
        K: parseFloat(novocultura.K) || 0,
        esterco: parseFloat(novocultura.esterco) || 0,
        FTE: parseFloat(novocultura.FTE) || 0,
        cN: parseFloat(novocultura.cN) || 0,
        cP: parseFloat(novocultura.cP) || 0,
        cK: parseFloat(novocultura.cK) || 0,
        cC: parseFloat(novocultura.cC) || 0,
        cFTE: parseFloat(novocultura.cFTE) || 0,
        cesterco: parseFloat(novocultura.cesterco) || 0,
        cova: novocultura.cova || '',
        covaArea: parseFloat(novocultura.covaArea) || 0,
        link: novocultura.link || '',
        pdf_filename: novocultura.pdf_filename || null,
        pdf_original_name: novocultura.pdf_original_name ? Buffer.from(novocultura.pdf_original_name, 'utf8').toString('utf8') : null,
        pdf_path: novocultura.pdf_path || null
      };

      console.log('📝 Modelo - Dados formatados para inserção:', culturaFormatada);

      const sql = "INSERT INTO cultura SET ?";
      const resultado = await this.executarQuery(sql, culturaFormatada);
      
      console.log('✅ Modelo - Cultura criada com sucesso:', resultado);
      return resultado;
    } catch (erro) {
      console.error('❌ Modelo - Erro ao criar cultura:', erro);
      throw erro;
    }
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