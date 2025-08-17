const fs = require('fs-extra');
const path = require('path');
const OpenAI = require('openai');
const taskModel = require('../Models/taskModel');
require('dotenv').config();

class AudioProcessor {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.shouldInterrupt = false; // Nova flag para interrupção
    this.lastRequestTime = Date.now(); // Tempo da última requisição
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.audioDir = path.join(__dirname, '../public/assets/audio');
    this.textDir = path.join(__dirname, '../public/assets/texto');
    
    // Garantir que as pastas existam
    fs.ensureDirSync(this.audioDir);
    fs.ensureDirSync(this.textDir);
  }

  // Método para notificar nova requisição (chamado pelo middleware)
  notifyRequest() {
    this.lastRequestTime = Date.now();
    if (this.isProcessing) {
      console.log('🛑 Interrompendo processamento de áudio devido a nova requisição');
      this.shouldInterrupt = true;
      
      // Forçar parada IMEDIATA
      setTimeout(() => {
        if (this.isProcessing && this.shouldInterrupt) {
          console.log('⚡ FORÇANDO parada do processamento...');
          this.isProcessing = false;
          this.shouldInterrupt = false;
          
          // Reiniciar processamento após 5 segundos
          setTimeout(() => {
            if (this.queue.length > 0) {
              console.log('🔄 Retomando processamento da fila...');
              this.processQueue();
            }
          }, 5000);
        }
      }, 2000); // 2 segundos para forçar parada
    }
  }

  // Adicionar arquivo à fila
  async addToQueue(audioFile) {
    // Verificar se já está na fila
    if (this.queue.includes(audioFile)) {
      console.log(`⚠️  Arquivo já está na fila: ${audioFile}`);
      return;
    }
    
    console.log(`🎵 Adicionando arquivo à fila: ${audioFile}`);
    this.queue.push(audioFile);
    
    if (!this.isProcessing) {
      // Usar setImmediate para não bloquear a requisição atual
      setImmediate(() => {
        this.processQueue();
      });
    }
  }

  // Processar fila com verificação de interrupção (não-bloqueante)
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.shouldInterrupt = false;
    console.log(`🔄 Iniciando processamento da fila. ${this.queue.length} arquivos pendentes`);

    // Processar de forma não-bloqueante
    this.processNextFile();
  }
  
  // Processar próximo arquivo de forma não-bloqueante
  async processNextFile() {
    // Verificar se deve parar
    if (this.queue.length === 0 || this.shouldInterrupt) {
      this.isProcessing = false;
      
      if (this.shouldInterrupt) {
        console.log('⏸️ Processamento interrompido - nova requisição detectada');
        console.log(`⏳ Processamento pausado. ${this.queue.length} arquivos restantes na fila`);
        this.shouldInterrupt = false;
      } else {
        console.log('✅ Fila de processamento concluída');
      }
      return;
    }
    
    const audioFile = this.queue.shift();
    
    try {
      await this.processAudioFile(audioFile);
    } catch (error) {
      console.error(`🚫 Erro crítico ao processar ${audioFile}:`, error.message);
      console.log('⏳ Continuando com próximo arquivo na fila...');
    }
    
    // Usar setImmediate para não bloquear o event loop
    setImmediate(() => {
      this.processNextFile();
    });
  }

  // Processar arquivo de áudio individual
  async processAudioFile(audioFile) {
    try {
      console.log(`🎤 Processando arquivo: ${audioFile}`);
      
      const audioPath = path.join(this.audioDir, audioFile);
      const textFileName = audioFile.replace('.wav', '.txt').replace('.mp3', '.txt');
      const textPath = path.join(this.textDir, textFileName);

      // Verificar se o arquivo existe
      if (!await fs.pathExists(audioPath)) {
        console.log(`❌ Arquivo não encontrado: ${audioPath}`);
        return;
      }

      // Verificar se já foi processado
      if (await fs.pathExists(textPath)) {
        console.log(`✅ Arquivo já processado: ${audioFile}`);
        return;
      }
      
      let transcription;
        console.log('🎙️ Usando API real da OpenAI');
        transcription = await this.transcribeAudio(audioFile);
      
      
      // Verificar se foi interrompido durante a transcrição
      if (this.shouldInterrupt) {
        console.log(`⏸️ Transcrição interrompida para: ${audioFile}`);
        return;
      }
      
      if (!transcription) {
        console.log(`⚠️  Transcrição falhou para: ${audioFile}`);
        
        // Criar arquivo de texto com erro para não tentar processar novamente
        const errorText = `ERRO: Transcrição falhou para ${audioFile}\nData: ${new Date().toISOString()}\nMotivo: Problema na API da OpenAI (quota/rate limit)`;
        await fs.writeFile(textPath, errorText, 'utf8');
        console.log(`📝 Arquivo de erro criado: ${textPath}`);
        
        console.log(`⏳ Continuando com próximo arquivo...`);
        return;
      }

      // Salvar texto em arquivo
      await fs.writeFile(textPath, transcription, 'utf8');
      console.log(`📝 Texto salvo em: ${textPath}`);

      // Atualizar banco de dados
      try {
        await this.updateTaskWithText(audioFile, textFileName, transcription);
        console.log(`📋 Banco de dados atualizado para: ${audioFile}`);
      } catch (dbError) {
        console.error(`⚠️  Erro ao atualizar banco para ${audioFile}:`, dbError.message);
        console.log(`📝 Texto foi salvo, mas banco não foi atualizado`);
      }
      
      console.log(`✅ Processamento concluído para: ${audioFile}`);

    } catch (error) {
      console.error(`🚫 Erro ao processar arquivo ${audioFile}:`, error.message);
      console.log(`⏳ Continuando com próximo arquivo...`);
    }
  }
  
  // Transcrever áudio usando OpenAI Whisper com timeout (DESABILITADO)
  async transcribeAudio(audioFile) {
    const TIMEOUT_MS = 30000; // 30 segundos
    const CHECK_INTERVAL = 500; // Verificar interrupção a cada 500ms
    
    try {
      const audioPath = path.join(this.audioDir, audioFile);
      console.log(`🎙️ Iniciando transcrição: ${audioFile}`);
      console.log(`⏱️  Timeout configurado para: ${TIMEOUT_MS/1000} segundos`);
      
      console.log(`🚀 Enviando requisição para OpenAI...`);
      
      // Verificar periodicamente se deve interromper
      const checkInterruption = () => {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (this.shouldInterrupt) {
              clearInterval(interval);
              reject(new Error('INTERRUPTED_BY_REQUEST'));
            }
          }, CHECK_INTERVAL);
          
          // Limpar interval após timeout
          setTimeout(() => {
            clearInterval(interval);
            reject(new Error('TIMEOUT_EXCEEDED'));
          }, TIMEOUT_MS);
        });
      };
      
      // Executar transcrição de forma não-bloqueante
      const transcriptionPromise = new Promise(async (resolve, reject) => {
        try {
          // Usar setImmediate para não bloquear
          setImmediate(async () => {
            try {
              const result = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(audioPath),
                model: 'whisper-1',
                response_format: 'text'
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
      
      // Corrida entre transcrição, timeout e verificação de interrupção
      const transcription = await Promise.race([
        transcriptionPromise,
        checkInterruption()
      ]);
      
      console.log(`✅ Transcrição concluída: ${transcription.substring(0, 100)}...`);
      return transcription;
      
    } catch (error) {
      if (error.message === 'INTERRUPTED_BY_REQUEST') {
        console.error('🛑 TRANSCRIÇÃO INTERROMPIDA - Nova requisição detectada');
        return null;
      } else if (error.message === 'TIMEOUT_EXCEEDED') {
        console.error('⏰ TIMEOUT - Transcrição demorou muito');
        return null;
      } else {
        console.error('🚫 ERRO OpenAI:', error.message);
        return null;
      }
    }
  }

  // Atualizar tarefa no banco de dados com o texto
  async updateTaskWithText(audioFile, textFileName, transcription) {
    try {
      // Buscar tarefa que tem o arquivo de áudio na coluna grav
      const tasks = await taskModel.buscarPorArquivo(audioFile);
      
      if (tasks && tasks.length > 0) {
        const task = tasks[0];
        
        // Construir o caminho completo para o arquivo de texto
        const textoArquivo = `public/assets/texto/${textFileName}`;
        
        console.log(`🔄 Atualizando tarefa ${task.id} com arquivo: ${textoArquivo}`);
        
        // Fazer requisição HTTP para atualizar o banco usando a rota existente
        const http = require('http');
        
        const postData = JSON.stringify({
          texto: transcription,
          texto_arquivo: transcription,
          descricao: transcription,
          nome: transcription.substring(0, 100)
        });
        
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/task/${task.id}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              console.log(`✅ Tarefa ${task.id} atualizada via HTTP com sucesso`);
              console.log(`📁 Campo texto_arquivo: ${textoArquivo}`);
              console.log(`📝 Resposta do servidor:`, response);
            } catch (parseError) {
              console.error('⚠️  Erro ao parsear resposta HTTP:', parseError.message);
            }
          });
        });
        
        req.on('error', async (error) => {
          console.error(`🚫 Erro na requisição HTTP: ${error.message}`);
          console.log('🚫 Tentando atualizar via modelo direto...');
          
          // Fallback: usar o modelo diretamente
          try {
            await taskModel.atualizarTexto(task.id, textoArquivo, transcription);
            console.log(`📋 Tarefa ${task.id} atualizada via modelo (fallback)`);
          } catch (fallbackError) {
            console.error(`🚫 Erro no fallback também: ${fallbackError.message}`);
          }
        });
        
        req.write(postData);
        req.end();
        
      } else {
        console.log(`📄 Nenhuma tarefa encontrada para o arquivo: ${audioFile}`);
        console.log(`📄 Arquivo processado mas não vinculado a uma tarefa`);
      }

    } catch (error) {
      console.error(`🚫 Erro ao atualizar tarefa para ${audioFile}:`, error.message);
      console.log('📝 O arquivo de texto foi salvo, mas a tarefa não foi atualizada');
      // Não lança o erro para não interromper o processamento
    }
  }

  // Monitorar pasta de áudio para novos arquivos
/*  async monitorAudioDirectory() {    
   try { const files = await fs.readdir(this.audioDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.wav') || file.endsWith('.mp3')
      );

      console.log(`📁 Encontrados ${audioFiles.length} arquivos de áudio`);

      for (const file of audioFiles) {
        // Verificar se já foi processado
        const textFile = file.replace('.wav', '.txt').replace('.mp3', '.txt');
        const textPath = path.join(this.textDir, textFile);
        
        if (!await fs.pathExists(textPath)) {
          await this.addToQueue(file);
        } else {
          console.log(`✅ Arquivo já processado: ${file}`);
        }
      }

    } catch (error) {
      console.error('❌ Erro ao monitorar pasta de áudio:', error);
    }
  } */


  // Iniciar monitoramento
  /*
  startMonitoring() {
    console.log('🎧 Iniciando monitoramento de pasta de áudio...');
    
    // Processar arquivos existentes
    this.monitorAudioDirectory();
    
    // Monitorar mudanças na pasta
    fs.watch(this.audioDir, async (eventType, filename) => {
      if (filename && (filename.endsWith('.wav') || filename.endsWith('.mp3'))) {
        console.log(`🆕 Novo arquivo detectado: ${filename}`);
        await this.addToQueue(filename);
      }
    });
  }
*/
  // Obter status do processamento
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      shouldInterrupt: this.shouldInterrupt,
      queueLength: this.queue.length,
      lastRequestTime: this.lastRequestTime,
      queue: [...this.queue]
    };
  }
}

module.exports = new AudioProcessor();
