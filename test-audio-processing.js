const fs = require('fs-extra');
const path = require('path');

// Teste do sistema de processamento de áudio
async function testAudioProcessing() {
  console.log('🧪 Iniciando testes do sistema de processamento de áudio...\n');

  try {
    // 1. Verificar se as pastas existem
    console.log('1. Verificando estrutura de pastas...');
    const audioDir = path.join(__dirname, 'public/assets/audio');
    const textDir = path.join(__dirname, 'public/assets/texto');
    
    if (!await fs.pathExists(audioDir)) {
      console.log('❌ Pasta de áudio não encontrada');
      await fs.ensureDir(audioDir);
      console.log('✅ Pasta de áudio criada');
    } else {
      console.log('✅ Pasta de áudio encontrada');
    }

    if (!await fs.pathExists(textDir)) {
      console.log('❌ Pasta de texto não encontrada');
      await fs.ensureDir(textDir);
      console.log('✅ Pasta de texto criada');
    } else {
      console.log('✅ Pasta de texto encontrada');
    }

    // 2. Verificar arquivos de áudio
    console.log('\n2. Verificando arquivos de áudio...');
    const audioFiles = await fs.readdir(audioDir);
    const wavFiles = audioFiles.filter(file => file.endsWith('.wav'));
    const mp3Files = audioFiles.filter(file => file.endsWith('.mp3'));
    
    console.log(`📁 Total de arquivos na pasta: ${audioFiles.length}`);
    console.log(`🎵 Arquivos WAV: ${wavFiles.length}`);
    console.log(`🎵 Arquivos MP3: ${mp3Files.length}`);

    if (wavFiles.length > 0 || mp3Files.length > 0) {
      console.log('✅ Arquivos de áudio encontrados');
      
      // Mostrar detalhes dos arquivos
      for (const file of [...wavFiles, ...mp3Files]) {
        const filePath = path.join(audioDir, file);
        const stats = await fs.stat(filePath);
        console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
    } else {
      console.log('⚠️ Nenhum arquivo de áudio encontrado');
    }

    // 3. Verificar arquivos de texto
    console.log('\n3. Verificando arquivos de texto...');
    const textFiles = await fs.readdir(textDir);
    const txtFiles = textFiles.filter(file => file.endsWith('.txt'));
    
    console.log(`📝 Arquivos de texto: ${txtFiles.length}`);

    if (txtFiles.length > 0) {
      console.log('✅ Arquivos de texto encontrados');
      
      for (const file of txtFiles) {
        const filePath = path.join(textDir, file);
        const stats = await fs.stat(filePath);
        console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
    } else {
      console.log('⚠️ Nenhum arquivo de texto encontrado');
    }

    // 4. Verificar dependências
    console.log('\n4. Verificando dependências...');
    
    try {
      require('openai');
      console.log('✅ OpenAI encontrado');
    } catch (error) {
      console.log('❌ OpenAI não encontrado - execute: npm install openai');
    }

    try {
      require('fs-extra');
      console.log('✅ fs-extra encontrado');
    } catch (error) {
      console.log('❌ fs-extra não encontrado - execute: npm install fs-extra');
    }

    // 5. Verificar variável de ambiente
    console.log('\n5. Verificando configuração...');
    
    if (process.env.OPENAI_API_KEY) {
      console.log('✅ OPENAI_API_KEY configurada');
    } else {
      console.log('⚠️ OPENAI_API_KEY não configurada - adicione ao arquivo .env');
    }

    // 6. Testar conexão com banco
    console.log('\n6. Verificando conexão com banco...');
    
    try {
      const conexao = require('./Database/conexao');
      await conexao.query('SELECT 1');
      console.log('✅ Conexão com banco OK');
    } catch (error) {
      console.log('❌ Erro na conexão com banco:', error.message);
    }

    // 7. Verificar estrutura da tabela task
    console.log('\n7. Verificando estrutura da tabela task...');
    
    try {
      const conexao = require('./Database/conexao');
      const [rows] = await conexao.query('DESCRIBE task');
      const hasTextColumn = rows.some(row => row.Field === 'texto');
      const hasTextFileColumn = rows.some(row => row.Field === 'texto_arquivo');
      
      if (hasTextColumn) {
        console.log('✅ Coluna "texto" encontrada');
      } else {
        console.log('❌ Coluna "texto" não encontrada - execute: ALTER TABLE task ADD COLUMN texto TEXT');
      }
      
      if (hasTextFileColumn) {
        console.log('✅ Coluna "texto_arquivo" encontrada');
      } else {
        console.log('❌ Coluna "texto_arquivo" não encontrada - execute: ALTER TABLE task ADD COLUMN texto_arquivo VARCHAR(255)');
      }
    } catch (error) {
      console.log('❌ Erro ao verificar tabela task:', error.message);
    }

    console.log('\n✅ Testes concluídos!');
    console.log('\n📋 Resumo:');
    console.log(`   - Arquivos de áudio: ${wavFiles.length + mp3Files.length}`);
    console.log(`   - Arquivos de texto: ${txtFiles.length}`);
    console.log(`   - Pronto para processamento: ${(wavFiles.length + mp3Files.length) > 0 ? 'Sim' : 'Não'}`);

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testAudioProcessing();
