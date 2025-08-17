
const audioProcessor = require('./audioProcessor');

class AudioService {
  constructor() {
    this.isRunning = false;
  }

  // Iniciar o serviço de processamento de áudio
  start() {
    if (this.isRunning) {
      console.log('🎧 Serviço de áudio já está rodando');
      return;
    }

    console.log('🎧 Iniciando serviço de processamento de áudio...');
    
    try {
      // Iniciar monitoramento
      //audioProcessor.startMonitoring();
      this.isRunning = true;
      
      console.log('✅ Serviço de processamento de áudio iniciado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao iniciar serviço de áudio:', error);
      this.isRunning = false;
    }
  }

  // Parar o serviço
  stop() {
    if (!this.isRunning) {
      console.log('🎧 Serviço de áudio não está rodando');
      return;
    }

    console.log('🛑 Parando serviço de processamento de áudio...');
    this.isRunning = false;
    
    // Limpar fila
    audioProcessor.queue = [];
    audioProcessor.isProcessing = false;
    
    console.log('✅ Serviço de processamento de áudio parado');
  }

  // Obter status do serviço
  getStatus() {
    return {
      running: this.isRunning,
      processing: audioProcessor.isProcessing,
      queueLength: audioProcessor.queue.length,
      queue: audioProcessor.queue
    };
  }
}

module.exports = new AudioService();
