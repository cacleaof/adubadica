const fs = require('fs');
const OpenAI = require('openai');

async function testarTranscricao() {
  try {
    const openai = new OpenAI({ 
      apiKey: "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",
    });
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream('public/assets/audio/audio_1754747470764-484327460.wav'),
      model: 'whisper-1'
    });

    fs.writeFileSync('public/assets/texto/123.txt', transcription.text);
    console.log('✅ Transcrição concluída e salva!');
    console.log('Texto:', transcription.text);
  } catch (error) {
    console.error('❌ Erro na transcrição:', error);
  }
}

testarTranscricao();