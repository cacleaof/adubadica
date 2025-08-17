require('dotenv').config();

const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
  }
};

// Verificar se a chave da API está configurada
if (!config.openai.apiKey) {
  console.warn('⚠️  OPENAI_API_KEY não configurada no arquivo .env');
  console.warn('   O analisador de despesas não funcionará sem esta chave');
}

module.exports = config;
