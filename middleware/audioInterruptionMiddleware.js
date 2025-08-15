const audioProcessor = require('../services/audioProcessor');

// Middleware para interromper processamento de áudio quando há requisições
function audioInterruptionMiddleware(req, res, next) {
  // Excluir requisições de áudio para evitar interrupção desnecessária
  if (!req.path.startsWith('/api/audio/')) {
    console.log(`🌐 Requisição externa detectada: ${req.method} ${req.path}`);
    
    // Notificar o processador de áudio sobre a nova requisição
    audioProcessor.notifyRequest();
  }
  
  // Continuar com a requisição
  next();
}

module.exports = audioInterruptionMiddleware;
