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
