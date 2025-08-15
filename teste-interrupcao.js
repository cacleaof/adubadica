const axios = require('axios');

async function testarInterrupcao() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('�� Iniciando teste de interrupção...');
    
    // 1. Verificar status inicial
    console.log('\n1. Status inicial:');
    const statusInicial = await axios.get(`${baseURL}/audio/status-detalhado`);
    console.log(statusInicial.data);
    
    // 2. Fazer uma requisição para testar interrupção
    console.log('\n2. Fazendo requisição para testar interrupção...');
    const testeInterrupcao = await axios.post(`${baseURL}/audio/testar-interrupcao`);
    console.log(testeInterrupcao.data);
    
    // 3. Verificar status após interrupção
    console.log('\n3. Status após interrupção:');
    const statusApos = await axios.get(`${baseURL}/audio/status-detalhado`);
    console.log(statusApos.data);
    
    // 4. Fazer outra requisição para verificar se ainda funciona
    console.log('\n4. Fazendo requisição adicional...');
    const arquivos = await axios.get(`${baseURL}/audio/arquivos`);
    console.log('Arquivos encontrados:', arquivos.data.total);
    
    console.log('\n✅ Teste de interrupção concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testarInterrupcao();
