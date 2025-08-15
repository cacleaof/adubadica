const audioProcessor = require('../services/audioProcessor');
const fs = require('fs-extra');
const path = require('path');

class AudioController {
  constructor() {
    this.audioDir = path.join(__dirname, '../public/assets/audio');
    this.textDir = path.join(__dirname, '../public/assets/texto');
  }

  // Iniciar processamento de áudio
  async iniciarProcessamento(req, res) {
    try {
      console.log('🎧 Iniciando processamento de áudio...');
      
      // Iniciar monitoramento
      audioProcessor.startMonitoring();
      
      res.status(200).json({
        message: 'Processamento de áudio iniciado com sucesso',
        status: 'monitoring'
      });
    } catch (error) {
      console.error('❌ Erro ao iniciar processamento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Processar arquivo específico
  async processarArquivo(req, res) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          error: 'Nome do arquivo é obrigatório'
        });
      }

      console.log(`🎤 Processando arquivo específico: ${filename}`);
      
      // Adicionar à fila de processamento
      await audioProcessor.addToQueue(filename);
      
      res.status(200).json({
        message: 'Arquivo adicionado à fila de processamento',
        filename: filename,
        status: 'queued'
      });
    } catch (error) {
      console.error('❌ Erro ao processar arquivo:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Listar arquivos de áudio
  async listarArquivos(req, res) {
    try {
      const files = await fs.readdir(this.audioDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.wav') || file.endsWith('.mp3')
      );

      const arquivosInfo = await Promise.all(
        audioFiles.map(async (file) => {
          const filePath = path.join(this.audioDir, file);
          const stats = await fs.stat(filePath);
          const textFile = file.replace('.wav', '.txt').replace('.mp3', '.txt');
          const textPath = path.join(this.textDir, textFile);
          const hasText = await fs.pathExists(textPath);

          return {
            nome: file,
            tamanho: stats.size,
            dataCriacao: stats.birthtime,
            dataModificacao: stats.mtime,
            processado: hasText,
            textoArquivo: hasText ? textFile : null
          };
        })
      );

      res.status(200).json({
        total: arquivosInfo.length,
        arquivos: arquivosInfo
      });
    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Obter status da fila
  async obterStatus(req, res) {
    try {
      const status = {
        processando: audioProcessor.isProcessing,
        fila: audioProcessor.queue.length,
        arquivosNaFila: audioProcessor.queue
      };

      res.status(200).json(status);
    } catch (error) {
      console.error('❌ Erro ao obter status:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Obter status detalhado da fila (incluindo interrupção)
  async obterStatusDetalhado(req, res) {
    try {
      const status = audioProcessor.getStatus();
      
      res.status(200).json({
        ...status,
        timestamp: new Date().toISOString(),
        tempoDesdeUltimaRequisicao: Date.now() - status.lastRequestTime
      });
    } catch (error) {
      console.error('❌ Erro ao obter status detalhado:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Testar interrupção manualmente
  async testarInterrupcao(req, res) {
    try {
      console.log('🧪 Testando interrupção manual...');
      audioProcessor.notifyRequest();
      
      res.status(200).json({
        message: 'Interrupção testada com sucesso',
        status: audioProcessor.getStatus()
      });
    } catch (error) {
      console.error('❌ Erro ao testar interrupção:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Limpar arquivos processados
  async limparProcessados(req, res) {
    try {
      const files = await fs.readdir(this.audioDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.wav') || file.endsWith('.mp3')
      );

      let removidos = 0;
      for (const file of audioFiles) {
        const textFile = file.replace('.wav', '.txt').replace('.mp3', '.txt');
        const textPath = path.join(this.textDir, textFile);
        
        if (await fs.pathExists(textPath)) {
          const audioPath = path.join(this.audioDir, file);
          await fs.remove(audioPath);
          await fs.remove(textPath);
          removidos++;
        }
      }

      res.status(200).json({
        message: `${removidos} arquivos processados foram removidos`,
        removidos: removidos
      });
    } catch (error) {
      console.error('❌ Erro ao limpar arquivos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Baixar arquivo de texto
  async baixarTexto(req, res) {
    try {
      const { filename } = req.params;
      const textFile = filename.replace('.wav', '.txt').replace('.mp3', '.txt');
      const textPath = path.join(this.textDir, textFile);

      if (!await fs.pathExists(textPath)) {
        return res.status(404).json({
          error: 'Arquivo de texto não encontrado'
        });
      }

      res.download(textPath, textFile);
    } catch (error) {
      console.error('❌ Erro ao baixar texto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
}

module.exports = new AudioController();
