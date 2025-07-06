const culturaModel = require('../Models/culturaModel');
const path = require('path');
const fs = require('fs');

class culturaController {
  async buscarTodos(req, res) {
    try {
      const culturas = await culturaModel.buscarTodos();
      
      // Mapear os campos para o formato esperado pelo frontend
      const culturasFormatadas = culturas.map(cultura => ({
        id: cultura.id,
        nome: cultura.nome,
        adubatipo: cultura.adubatipo,
        tipo: cultura.tipo,
        N: cultura.N,
        P: cultura.P,
        K: cultura.K,
        esterco: cultura.esterco,
        FTE: cultura.FTE,
        cN: cultura.cN,
        cP: cultura.cP,
        cK: cultura.cK,
        cC: cultura.cC,
        cFTE: cultura.cFTE,
        cesterco: cultura.cesterco,
        cova: cultura.cova,
        covaArea: cultura.covaArea,
        link: cultura.link,
        pdfFileName: cultura.pdf_filename, // Mapear para o formato esperado pelo frontend
        pdfOriginalName: cultura.pdf_original_name,
        pdfPath: cultura.pdf_path
      }));
      
      res.status(200).json(culturasFormatadas);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const culturas = await culturaModel.buscar(id);
      
      if (culturas && culturas.length > 0) {
        const cultura = culturas[0];
        // Mapear os campos para o formato esperado pelo frontend
        const culturaFormatada = {
          id: cultura.id,
          nome: cultura.nome,
          adubatipo: cultura.adubatipo,
          tipo: cultura.tipo,
          N: cultura.N,
          P: cultura.P,
          K: cultura.K,
          esterco: cultura.esterco,
          FTE: cultura.FTE,
          cN: cultura.cN,
          cP: cultura.cP,
          cK: cultura.cK,
          cC: cultura.cC,
          cFTE: cultura.cFTE,
          cesterco: cultura.cesterco,
          cova: cultura.cova,
          covaArea: cultura.covaArea,
          link: cultura.link,
          pdfFileName: cultura.pdf_filename, // Mapear para o formato esperado pelo frontend
          pdfOriginalName: cultura.pdf_original_name,
          pdfPath: cultura.pdf_path
        };
        res.status(200).json(culturaFormatada);
      } else {
        res.status(404).json({ error: 'Cultura não encontrada' });
      }
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novocultura = req.body;
      const culturaCriado = await culturaModel.criar(novocultura);
      res.status(201).json(culturaCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const culturaAtualizado = req.body;
      const resultculturaAtualizado = await culturaModel.atualizar(culturaAtualizado, id);
      res.status(200).json(resultculturaAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadoculturaDeletado = await culturaModel.deletar(id);
      res.status(200).json(resultadoculturaDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  // Novo método para criar cultura com PDF
  async criarComPDF(req, res) {
    try {
      console.log('📥 Recebendo requisição para criar cultura com PDF');
      console.log('📄 Arquivo recebido:', req.file);
      console.log('📋 Dados da cultura (req.body):', req.body);
      console.log('📋 Headers da requisição:', req.headers);
      console.log('📋 Content-Type:', req.headers['content-type']);

      if (!req.body.cultura) {
        console.log('❌ Campo "cultura" não encontrado no body');
        return res.status(400).json({ error: 'Dados da cultura não encontrados' });
      }

      let culturaData;
      try {
        culturaData = JSON.parse(req.body.cultura);
        console.log('✅ Dados da cultura parseados com sucesso:', culturaData);
      } catch (parseError) {
        console.log('❌ Erro ao fazer parse dos dados da cultura:', parseError);
        return res.status(400).json({ error: 'Dados da cultura inválidos' });
      }

      const pdfFile = req.file;

      if (!pdfFile) {
        console.log('❌ Nenhum arquivo PDF foi enviado');
        return res.status(400).json({ error: 'Nenhum arquivo PDF foi enviado' });
      }

      console.log('✅ Arquivo PDF recebido:', {
        filename: pdfFile.filename,
        originalname: pdfFile.originalname,
        size: pdfFile.size,
        path: pdfFile.path
      });

      // Adicionar informações do arquivo aos dados da cultura
      culturaData.pdf_filename = pdfFile.filename;
      culturaData.pdf_original_name = pdfFile.originalname;
      culturaData.pdf_path = pdfFile.path;

      console.log('📝 Dados formatados para inserção:', culturaData);

      const culturaCriado = await culturaModel.criar(culturaData);
      
      console.log('✅ Cultura criada com sucesso:', culturaCriado);
      
      res.status(201).json({
        message: 'Cultura criada com PDF com sucesso!',
        cultura: culturaCriado,
        pdf_info: {
          filename: pdfFile.filename,
          originalname: pdfFile.originalname,
          size: pdfFile.size
        }
      });
    } catch (error) {
      console.error('❌ Erro ao criar cultura com PDF:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Método para download de PDF
  async downloadPDF(req, res) {
    try {
      const { id } = req.params;
      console.log('📥 Recebendo requisição para download de PDF da cultura ID:', id);
      
      const culturas = await culturaModel.buscar(id);
      console.log(' Resultado da busca:', culturas);

      if (!culturas || culturas.length === 0) {
        console.log('❌ Cultura não encontrada');
        return res.status(404).json({ error: 'Cultura não encontrada' });
      }

      const cultura = culturas[0]; // Pegar o primeiro resultado
      console.log('📄 Dados da cultura:', cultura);

      if (!cultura.pdf_filename) {
        console.log('❌ PDF não encontrado para esta cultura');
        return res.status(404).json({ error: 'PDF não encontrado para esta cultura' });
      }

      const filePath = path.join(__dirname, '../assets/uploads', cultura.pdf_filename);
      console.log(' Caminho do arquivo:', filePath);

      if (!fs.existsSync(filePath)) {
        console.log('❌ Arquivo PDF não encontrado no servidor');
        return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
      }

      console.log('✅ Arquivo encontrado, enviando...');
      res.download(filePath, cultura.pdf_original_name || cultura.pdf_filename);
    } catch (error) {
      console.error('❌ Erro ao fazer download do PDF:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Método para visualizar PDF
  async visualizarPDF(req, res) {
    try {
      const { id } = req.params;
      const cultura = await culturaModel.buscar(id);

      if (!cultura || !cultura.pdf_filename) {
        return res.status(404).json({ error: 'PDF não encontrado para esta cultura' });
      }

      const filePath = path.join(__dirname, '../assets/uploads', cultura.pdf_filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
      }

      // Configurar headers para visualização no navegador
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=' + (cultura.pdf_original_name || cultura.pdf_filename));
      
      // Enviar o arquivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para listar PDFs disponíveis
  async listarPDFs(req, res) {
    try {
      const uploadDir = path.join(__dirname, '../assets/uploads');
      
      if (!fs.existsSync(uploadDir)) {
        return res.status(200).json({ pdfs: [] });
      }

      const files = fs.readdirSync(uploadDir);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

      const pdfs = pdfFiles.map(file => {
        const stats = fs.statSync(path.join(uploadDir, file));
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });

      res.status(200).json({ pdfs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new culturaController();
