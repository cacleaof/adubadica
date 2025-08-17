const despesaAnalyzer = require('../services/despesaAnalyzer');
const despesaModel = require('../Models/despesaModel');

class DespesaAnalyzerController {
  // Analisar despesas com ChatGPT
  async analisarDespesas(req, res) {
    try {
      console.log('🔍 Iniciando análise de despesas...');
      console.log('📝 Body recebido:', req.body);
      
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          error: 'Prompt é obrigatório',
          message: 'Forneça um prompt descrevendo o que você quer analisar'
        });
      }

      console.log('📊 Verificando conexão com banco...');
      
      // Verificar se o modelo pode ser acessado
      if (!despesaModel) {
        throw new Error('Modelo de despesas não encontrado');
      }

      // Buscar todas as despesas
      const despesas = await despesaModel.buscarTodos();
      console.log(`📈 Despesas encontradas: ${despesas ? despesas.length : 'null'}`);
      
      if (!despesas || despesas.length === 0) {
        return res.status(404).json({
          error: 'Nenhuma despesa encontrada',
          message: 'Não há dados para analisar'
        });
      }

      console.log(`📈 Analisando ${despesas.length} despesas...`);
      
      // Verificar se o serviço pode ser acessado
      if (!despesaAnalyzer) {
        throw new Error('Serviço de análise não encontrado');
      }

      // Realizar análise com ChatGPT
      const resultado = await despesaAnalyzer.analisarDespesas(despesas, prompt);
      console.log('📊 Resultado da análise:', resultado);
      
      if (resultado.sucesso) {
        res.status(200).json({
          message: 'Análise concluída com sucesso',
          resultado: resultado
        });
      } else {
        res.status(500).json({
          error: 'Erro na análise',
          message: resultado.erro
        });
      }

    } catch (error) {
      console.error('❌ Erro detalhado no controller de análise:', error);
      console.error('❌ Stack trace:', error.stack);
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Gerar código de gráfico específico
  async gerarGrafico(req, res) {
    try {
      const { tipoGrafico, promptEspecifico } = req.body;
      
      if (!tipoGrafico) {
        return res.status(400).json({
          error: 'Tipo de gráfico é obrigatório',
          message: 'Especifique o tipo de gráfico desejado'
        });
      }

      console.log(`📊 Gerando gráfico: ${tipoGrafico}`);
      
      // Buscar despesas
      const despesas = await despesaModel.buscarTodos();
      
      if (!despesas || despesas.length === 0) {
        return res.status(404).json({
          error: 'Nenhuma despesa encontrada',
          message: 'Não há dados para gerar gráfico'
        });
      }

      // Gerar código do gráfico
      const resultado = await despesaAnalyzer.gerarCodigoGrafico(
        despesas, 
        tipoGrafico, 
        promptEspecifico || ''
      );
      
      if (resultado.sucesso) {
        res.status(200).json({
          message: 'Código do gráfico gerado com sucesso',
          resultado: resultado
        });
      } else {
        res.status(500).json({
          error: 'Erro ao gerar gráfico',
          message: resultado.erro
        });
      }

    } catch (error) {
      console.error('❌ Erro ao gerar gráfico:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Obter status do serviço
  async getStatus(req, res) {
    try {
      const status = despesaAnalyzer.getStatus();
      res.status(200).json(status);
    } catch (error) {
      console.error('❌ Erro ao obter status:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
}

module.exports = new DespesaAnalyzerController();
