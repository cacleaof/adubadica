const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;
const router = require('./Routers/index');
const conexao = require('./Database/conexao');
const tabelas = require('./Database/criar_tabelas');
const dados = require('./Database/migrar_dados');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Configuração de CORS mais específica
const corsOptions = {
    origin: [
        'https://angion.vercel.app',
        'http://localhost:3000',
        'http://localhost:4200',
        'http://localhost:8080',
        'https://caleao.space',
        'http://200.98.64.202'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, 'public/assets/boleto');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `boleto_${uniqueSuffix}${ext}`);
    }
  });
  const upload = multer({ storage: storage });

app.use(cors(corsOptions));

// Middleware para adicionar headers CORS manualmente se necessário
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        // Timeout de 15 segundos para todas as requisições
        req.setTimeout(15000);
        res.setTimeout(15000);
        next();
    }
});

// Endpoint para upload
app.post('/api/upload-boleto', upload.single('boleto'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    // Caminho para acessar a imagem pelo frontend
    const filePath = `/assets/boleto/${req.file.filename}`;
    res.json({ success: true, path: filePath });
  });

// Endpoint para servir imagens
app.get('/api/imagem/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // Caminho para a pasta de boletos
  const imagePath = path.join(__dirname, 'public/assets/boleto', filename);
  
  console.log('🔍 Tentando servir imagem:', filename);
  console.log('📁 Caminho completo:', imagePath);
  
  // Listar todos os arquivos na pasta para debug
  const boletoDir = path.join(__dirname, 'public/assets/boleto');
  if (fs.existsSync(boletoDir)) {
    const files = fs.readdirSync(boletoDir);
    console.log('📂 Arquivos disponíveis na pasta:', files);
  }
  
  // Verificar se o arquivo existe
  if (fs.existsSync(imagePath)) {
    console.log('✅ Arquivo encontrado, enviando...');
    res.sendFile(imagePath);
  } else {
    console.log('❌ Arquivo não encontrado:', imagePath);
    res.status(404).json({ 
      error: 'Imagem não encontrada',
      requestedFile: filename,
      fullPath: imagePath,
      availableFiles: fs.existsSync(boletoDir) ? fs.readdirSync(boletoDir) : []
    });
  }
});

// Endpoint de teste para upload de PDF
app.post('/api/test-upload', upload.single('pdf'), (req, res) => {
  console.log('🧪 Teste de upload - Arquivo recebido:', req.file);
  console.log('🧪 Teste de upload - Body:', req.body);
  
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  
  res.json({ 
    success: true, 
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    }
  });
});

// Endpoint de teste para verificar cultura
app.get('/api/test-cultura/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🧪 Teste - Verificando cultura ID:', id);
    
    const culturaModel = require('./Models/culturaModel');
    const culturas = await culturaModel.buscar(id);
    
    console.log('🧪 Teste - Resultado da busca:', culturas);
    
    if (!culturas || culturas.length === 0) {
      return res.status(404).json({ error: 'Cultura não encontrada' });
    }
    
    const cultura = culturas[0];
    console.log('🧪 Teste - Dados da cultura:', cultura);
    
    res.json({
      success: true,
      cultura: {
        id: cultura.id,
        nome: cultura.nome,
        pdf_filename: cultura.pdf_filename,
        pdf_original_name: cultura.pdf_original_name,
        pdf_path: cultura.pdf_path
      }
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de teste para verificar se o arquivo PDF existe
app.get('/api/test-pdf/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    console.log('🧪 Teste - Verificando arquivo PDF:', filename);
    
    const filePath = path.join(__dirname, 'assets/uploads', filename);
    console.log('🧪 Teste - Caminho completo:', filePath);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log('✅ Arquivo encontrado:', {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      });
      
      res.json({
        success: true,
        exists: true,
        file: {
          filename: filename,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      });
    } else {
      console.log('❌ Arquivo não encontrado');
      
      // Listar arquivos na pasta para debug
      const uploadDir = path.join(__dirname, 'assets/uploads');
      let files = [];
      if (fs.existsSync(uploadDir)) {
        files = fs.readdirSync(uploadDir);
      }
      
      res.json({
        success: false,
        exists: false,
        requestedFile: filename,
        availableFiles: files
      });
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de teste para download de PDF
app.get('/api/test-download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🧪 Teste - Download PDF para cultura ID:', id);
    
    const culturaModel = require('./Models/culturaModel');
    const culturas = await culturaModel.buscar(id);
    
    if (!culturas || culturas.length === 0) {
      return res.status(404).json({ error: 'Cultura não encontrada' });
    }
    
    const cultura = culturas[0];
    console.log('🧪 Teste - Dados da cultura:', cultura);
    
    if (!cultura.pdf_filename) {
      return res.status(404).json({ error: 'PDF não encontrado para esta cultura' });
    }
    
    const filePath = path.join(__dirname, 'assets/uploads', cultura.pdf_filename);
    console.log('🧪 Teste - Caminho do arquivo:', filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
    }
    
    console.log('✅ Arquivo encontrado, tentando download...');
    
    // Tentar fazer o download
    res.download(filePath, cultura.pdf_original_name || cultura.pdf_filename, (err) => {
      if (err) {
        console.error('❌ Erro no download:', err);
        res.status(500).json({ error: 'Erro ao fazer download do arquivo' });
      } else {
        console.log('✅ Download realizado com sucesso');
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no teste de download:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicializa as tabelas e dados de forma assíncrona
async function inicializarBanco() {
    try {
        await tabelas.init(conexao);
        //await dados.init(conexao);
        console.log('Banco de dados inicializado com sucesso!');
    } catch (erro) {
        console.error('Erro ao inicializar banco de dados:', erro);
    }
}

inicializarBanco();

router(app, express);

app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, (error) => {
    if(error) {
        console.error(`Error starting server: ${error}`);
    } else {
        console.log(`Server is running on http://localhost:${port}`);   
    }
});
