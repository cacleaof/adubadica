const OpenAI = require('openai');
require('dotenv').config();

class DespesaAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Analisar dados de despesas e gerar insights
  async analisarDespesas(dadosDespesas, promptUsuario) {
    try {
      console.log('🔍 Iniciando análise de despesas com ChatGPT...');
      
      // Preparar dados para análise (versão otimizada)
      const dadosFormatados = this.formatarDadosParaAnaliseOtimizada(dadosDespesas);
      
      // Criar prompt para o ChatGPT (versão compacta)
      const prompt = this.criarPromptAnaliseCompacto(dadosFormatados, promptUsuario);
      
      console.log('📝 Enviando prompt para OpenAI...');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Usar modelo mais econômico
        messages: [
          {
            role: 'system',
            content: 'Especialista em análise financeira. Analise despesas e forneça insights em português brasileiro.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000, // Reduzir tokens de saída
        temperature: 0.7
      });

      const analise = response.choices[0].message.content;
      console.log('✅ Análise concluída com sucesso');
      
      return {
        sucesso: true,
        analise: analise,
        dadosFormatados: dadosFormatados,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro na análise de despesas:', error.message);
      return {
        sucesso: false,
        erro: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Gerar código de gráfico baseado na análise
  async gerarCodigoGrafico(dadosDespesas, tipoGrafico, promptEspecifico) {
    try {
      console.log(`📊 Gerando código para gráfico: ${tipoGrafico}`);
      
      // Usar dados otimizados
      const dadosFormatados = this.formatarDadosParaAnaliseOtimizada(dadosDespesas);
      
      // Gerar código baseado no tipo de gráfico
      let codigoGrafico;
      
      switch (tipoGrafico) {
        case 'pizza':
          codigoGrafico = this.gerarCodigoGraficoPizza(dadosFormatados);
          break;
        case 'barras':
          codigoGrafico = this.gerarCodigoGraficoBarras(dadosFormatados);
          break;
        case 'linha':
          codigoGrafico = this.gerarCodigoGraficoLinha(dadosFormatados);
          break;
        case 'area':
          codigoGrafico = this.gerarCodigoGraficoArea(dadosFormatados);
          break;
        case 'radar':
          codigoGrafico = this.gerarCodigoGraficoRadar(dadosFormatados);
          break;
        default:
          codigoGrafico = this.gerarCodigoGraficoPizza(dadosFormatados);
      }
      
      console.log('✅ Código do gráfico gerado com sucesso');
      
      return {
        sucesso: true,
        codigo: codigoGrafico,
        tipoGrafico: tipoGrafico,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro ao gerar código do gráfico:', error.message);
      return {
        sucesso: false,
        erro: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Gerar código para gráfico de pizza
  gerarCodigoGraficoPizza(dadosFormatados) {
    const tipos = Object.keys(dadosFormatados.porTipo);
    const valores = Object.values(dadosFormatados.porTipo);
    const cores = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    
    return `
      <div style="width: 100%; max-width: 600px; margin: 0 auto;">
        <canvas id="graficoPizza" width="400" height="400"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('graficoPizza').getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ${JSON.stringify(tipos)},
            datasets: [{
              data: ${JSON.stringify(valores)},
              backgroundColor: ${JSON.stringify(cores.slice(0, tipos.length))},
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return label + ': R$ ' + value.toFixed(2) + ' (' + percentage + '%)';
                  }
                }
              }
            }
          }
        });
      </script>
    `;
  }

  // Gerar código para gráfico de barras
  gerarCodigoGraficoBarras(dadosFormatados) {
    const meses = Object.keys(dadosFormatados.porMes);
    const valores = Object.values(dadosFormatados.porMes).map(m => m.total);
    
    return `
      <div style="width: 100%; max-width: 800px; margin: 0 auto;">
        <canvas id="graficoBarras" width="600" height="400"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('graficoBarras').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ${JSON.stringify(meses)},
            datasets: [{
              label: 'Total de Despesas por Mês',
              data: ${JSON.stringify(valores)},
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'R$ ' + value.toFixed(2);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return 'Total: R$ ' + context.parsed.y.toFixed(2);
                  }
                }
              }
            }
          }
        });
      </script>
    `;
  }

  // Gerar código para gráfico de linha
  gerarCodigoGraficoLinha(dadosFormatados) {
    const meses = Object.keys(dadosFormatados.porMes);
    const valores = Object.values(dadosFormatados.porMes).map(m => m.total);
    
    return `
      <div style="width: 100%; max-width: 800px; margin: 0 auto;">
        <canvas id="graficoLinha" width="600" height="400"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('graficoLinha').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(meses)},
            datasets: [{
              label: 'Evolução das Despesas',
              data: ${JSON.stringify(valores)},
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'R$ ' + value.toFixed(2);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return 'Valor: R$ ' + context.parsed.y.toFixed(2);
                  }
                }
              }
            }
          }
        });
      </script>
    `;
  }

  // Gerar código para gráfico de área
  gerarCodigoGraficoArea(dadosFormatados) {
    const meses = Object.keys(dadosFormatados.porMes);
    const valores = Object.values(dadosFormatados.porMes).map(m => m.total);
    
    return `
      <div style="width: 100%; max-width: 800px; margin: 0 auto;">
        <canvas id="graficoArea" width="600" height="400"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('graficoArea').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(meses)},
            datasets: [{
              label: 'Despesas Acumuladas',
              data: ${JSON.stringify(valores)},
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.3)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'R$ ' + value.toFixed(2);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return 'Valor: R$ ' + context.parsed.y.toFixed(2);
                  }
                }
              }
            }
          }
        });
      </script>
    `;
  }

  // Gerar código para gráfico de radar
  gerarCodigoGraficoRadar(dadosFormatados) {
    const tipos = Object.keys(dadosFormatados.porTipo);
    const valores = Object.values(dadosFormatados.porTipo);
    
    return `
      <div style="width: 100%; max-width: 600px; margin: 0 auto;">
        <canvas id="graficoRadar" width="500" height="500"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('graficoRadar').getContext('2d');
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ${JSON.stringify(tipos)},
            datasets: [{
              label: 'Distribuição por Tipo',
              data: ${JSON.stringify(valores)},
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 2,
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'R$ ' + value.toFixed(2);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return 'Valor: R$ ' + context.parsed.r.toFixed(2);
                  }
                }
              }
            }
          }
        });
      </script>
    `;
  }

  // Formatar dados para análise (versão otimizada)
  formatarDadosParaAnaliseOtimizada(dadosDespesas) {
    try {
      // Limitar a quantidade de dados para reduzir tokens
      const despesasLimitadas = dadosDespesas.slice(0, 50); // Máximo 50 despesas
      
      // Agrupar por mês (últimos 6 meses)
      const despesasPorMes = {};
      const totalPorTipo = {};
      const totalPorStatus = { pago: 0, pendente: 0 };
      
      despesasLimitadas.forEach(despesa => {
        const data = new Date(despesa.venc);
        const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        
        // Agrupar por mês
        if (!despesasPorMes[mesAno]) {
          despesasPorMes[mesAno] = {
            total: 0,
            quantidade: 0
          };
        }
        
        despesasPorMes[mesAno].total += parseFloat(despesa.valor) || 0;
        despesasPorMes[mesAno].quantidade += 1;
        
        // Agrupar por tipo (máximo 10 tipos)
        const tipo = despesa.tipo || 'Sem categoria';
        if (!totalPorTipo[tipo]) {
          totalPorTipo[tipo] = 0;
        }
        totalPorTipo[tipo] += parseFloat(despesa.valor) || 0;
        
        // Agrupar por status
        if (despesa.pago) {
          totalPorStatus.pago += parseFloat(despesa.valor) || 0;
        } else {
          totalPorStatus.pendente += parseFloat(despesa.valor) || 0;
        }
      });

      // Manter apenas os tipos mais relevantes (top 5)
      const tiposOrdenados = Object.entries(totalPorTipo)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      return {
        resumo: {
          totalDespesas: dadosDespesas.length,
          valorTotal: dadosDespesas.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0),
          mediaPorDespesa: dadosDespesas.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0) / dadosDespesas.length
        },
        porMes: despesasPorMes,
        porTipo: tiposOrdenados,
        porStatus: totalPorStatus,
        // Não incluir despesas individuais para economizar tokens
        amostra: despesasLimitadas.slice(0, 5).map(d => ({
          nome: d.nome,
          valor: d.valor,
          tipo: d.tipo,
          venc: d.venc
        }))
      };

    } catch (error) {
      console.error('❌ Erro ao formatar dados:', error.message);
      return {
        resumo: {
          totalDespesas: dadosDespesas.length,
          valorTotal: 0,
          mediaPorDespesa: 0
        }
      };
    }
  }

  // Criar prompt para análise (versão compacta)
  criarPromptAnaliseCompacto(dadosFormatados, promptUsuario) {
    return `Analise dados de despesas e forneça insights em português:

RESUMO: ${dadosFormatados.resumo.totalDespesas} despesas, R$ ${dadosFormatados.resumo.valorTotal.toFixed(2)} total
POR MÊS: ${Object.entries(dadosFormatados.porMes).map(([mes, info]) => `${mes}: R$ ${info.total.toFixed(2)}`).join(', ')}
POR TIPO: ${Object.entries(dadosFormatados.porTipo).map(([tipo, valor]) => `${tipo}: R$ ${valor.toFixed(2)}`).join(', ')}
STATUS: Pago R$ ${dadosFormatados.porStatus.pago.toFixed(2)}, Pendente R$ ${dadosFormatados.porStatus.pendente.toFixed(2)}

ANÁLISE SOLICITADA: ${promptUsuario}

Forneça: 1) Resumo executivo, 2) Tendências principais, 3) Recomendações, 4) Sugestões de gráficos.`;
  }

  // Obter status do serviço
  getStatus() {
    return {
      ativo: true,
      timestamp: new Date().toISOString(),
      openaiConfigurado: !!process.env.OPENAI_API_KEY,
      modelo: 'gpt-3.5-turbo (otimizado para tokens)'
    };
  }
}

module.exports = new DespesaAnalyzer();
