const conexao = require('../Database/conexao');
    
class despesaModel {
  async executarQuery(sql, params) {
    try {    
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM despesa WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM despesa';
    return this.executarQuery(sql);
  }

  async criar(novodespesa) {
    // Validação básica
    if (!novodespesa) {
      throw new Error('Dados da despesa são obrigatórios');
    }

    try {
      console.log('Dados recebidos no modelo:', novodespesa);

      // Validação de campos obrigatórios
      if (!novodespesa.nome) {
        throw new Error('Nome é obrigatório');
      }

      // Formata a data atual se não houver data de vencimento
      const dataAtual = new Date();
      const dataFormatada = novodespesa.venc || 
        `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;

      const novodespesaFormatada = {
        nome: novodespesa.nome.trim(),
        descricao: (novodespesa.descricao || '').trim(),
        tipo: (novodespesa.tipo || '').trim(),
        valor: parseFloat(novodespesa.valor) || 0,
        venc: dataFormatada,
        CD: (novodespesa.CD || '').trim(),
        pix: (novodespesa.pix || '').trim(),
        codbar: (novodespesa.codbar || '').trim(),
        parc: (novodespesa.parc || 0),
        nparc: (novodespesa.nparc || 0),
        imagem: (novodespesa.imagem || '').trim(),
        valorpg: parseFloat(novodespesa.valorpg) || 0,
        adubatipo: (novodespesa.adubatipo || '').trim(),
      };

      console.log('Dados formatados para inserção:', novodespesaFormatada);

      const sql = "INSERT INTO despesa SET ?";
      return this.executarQuery(sql, novodespesaFormatada);
    } catch (erro) {
      console.error('Erro ao processar despesa:', erro);
      throw erro;
    }
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM despesa WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(despesaAtualizado, id) {
    const sql = 'UPDATE despesa SET ? WHERE id = ?';
    return this.executarQuery(sql, [despesaAtualizado, id]);
  }
}

module.exports = new despesaModel();