const conexao = require('../Database/conexao');
    
class despesaModel {

  executarQuery(sql, params) {
    return new Promise((resolve, reject) => {
      console.log('Executando SQL:', sql);
      console.log('Parâmetros:', JSON.stringify(params, null, 2));
      
      conexao.query(sql, params, (erro, resultados) => {
        if (erro) {
          console.error('Erro na execução da query:', erro.message);
          console.error('Código do erro:', erro.code);
          console.error('SQL Estado:', erro.sqlState);
          return reject(erro);
        }
        console.log('Query executada com sucesso. Resultados:', resultados);
        return resolve(resultados);
      });
    });
  }
   buscar(id) {
    const sql = 'SELECT * FROM despesa WHERE id = ?';
    return this.executarQuery(sql, id);
  }
  buscarTodos() {
    const sql = 'SELECT * FROM despesa';
    return this.executarQuery(sql);
  }

  criar(novodespesa) {
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
        cd: (novodespesa.CD || '').trim()
      };

      console.log('Dados formatados para inserção:', novodespesaFormatada);

      const sql = "INSERT INTO despesa SET ?";
      return this.executarQuery(sql, novodespesaFormatada);
    } catch (erro) {
      console.error('Erro ao processar despesa:', erro);
      throw erro;
    }
  }
    
  deletar(id) {
    const sql = 'DELETE FROM despesa WHERE id = ?';
    return this.executarQuery(sql, id);}

  atualizar(despesaAtualizado, id) {
        const sql = 'UPDATE despesa SET ? WHERE id = ?';
        return this.executarQuery(sql, [despesaAtualizado, id])}
  }
    module.exports = new despesaModel();