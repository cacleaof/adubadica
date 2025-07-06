const projModel = require('../Models/projModel');
const path = require('path');
const fs = require('fs');

class projController {
  async buscarTodos(req, res) {
    try {
      const projs = await projModel.buscarTodos();
      res.status(200).json(projs);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const projs = await projModel.buscar(id);
      res.status(200).json(projs);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async criar(req, res) {
    try {
      const novoproj = req.body;
      const projCriado = await projModel.criar(novoproj);
      res.status(201).json(projCriado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const projAtualizado = req.body;
      const resultprojAtualizado = await projModel.atualizar(projAtualizado, id);
      res.status(200).json(resultprojAtualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultadoprojDeletado = await projModel.deletar(id);
      res.status(200).json(resultadoprojDeletado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  // Novo método: buscar projetos dependentes de um projeto específico
  async buscarDependentes(req, res) {
    try {
      const { id } = req.params;
      const dependentes = await projModel.buscarDependentes(id);
      res.status(200).json({
        projeto_id: id,
        dependentes: dependentes,
        total_dependentes: dependentes.length
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: buscar projeto pai de um projeto dependente
  async buscarProjetoPai(req, res) {
    try {
      const { id } = req.params;
      const projetoPai = await projModel.buscarProjetoPai(id);
      
      if (projetoPai && projetoPai.length > 0) {
        res.status(200).json({
          projeto_dependente_id: id,
          projeto_pai: projetoPai[0]
        });
      } else {
        res.status(404).json({ 
          error: 'Projeto pai não encontrado',
          message: 'Este projeto não possui um projeto pai ou o projeto pai foi removido'
        });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: buscar todos os projetos com suas dependências
  async buscarComDependencias(req, res) {
    try {
      const projetos = await projModel.buscarComDependencias();
      res.status(200).json(projetos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: buscar projetos raiz (sem dependências)
  async buscarProjetosRaiz(req, res) {
    try {
      const projetosRaiz = await projModel.buscarProjetosRaiz();
      res.status(200).json({
        projetos_raiz: projetosRaiz,
        total_projetos_raiz: projetosRaiz.length
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: buscar árvore de dependências
  async buscarArvoreDependencias(req, res) {
    try {
      const { id } = req.params;
      const arvore = await projModel.buscarArvoreDependencias(id);
      res.status(200).json({
        projeto_raiz_id: id,
        arvore_dependencias: arvore,
        total_niveis: arvore.length > 0 ? Math.max(...arvore.map(p => p.nivel)) + 1 : 0
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: validar dependência circular
  async validarDependenciaCircular(req, res) {
    try {
      const { id } = req.params;
      const { dep_id } = req.body;

      if (id === dep_id) {
        return res.status(400).json({ 
          error: 'Dependência circular detectada',
          message: 'Um projeto não pode depender de si mesmo'
        });
      }

      // Verificar se o projeto dependente existe
      const projetoDependente = await projModel.buscar(dep_id);
      if (!projetoDependente || projetoDependente.length === 0) {
        return res.status(404).json({ 
          error: 'Projeto dependente não encontrado',
          message: `Projeto com ID ${dep_id} não existe`
        });
      }

      // Verificar se não há dependência circular na árvore
      const arvore = await projModel.buscarArvoreDependencias(dep_id);
      const idsNaArvore = arvore.map(p => p.id);
      
      if (idsNaArvore.includes(parseInt(id))) {
        return res.status(400).json({ 
          error: 'Dependência circular detectada',
          message: 'Esta dependência criaria um ciclo na hierarquia de projetos'
        });
      }

      res.status(200).json({ 
        message: 'Dependência válida',
        projeto_id: id,
        projeto_dependente_id: dep_id
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: criar projeto com PDF
  async criarComPDF(req, res) {
    try {
      console.log('📥 Recebendo requisição para criar projeto com PDF');
      console.log('📄 Arquivo recebido:', req.file);
      console.log(' Dados do projeto (req.body):', req.body);

      if (!req.body.projeto) {
        console.log('❌ Campo "projeto" não encontrado no body');
        return res.status(400).json({ error: 'Dados do projeto não encontrados' });
      }

      let projetoData;
      try {
        projetoData = JSON.parse(req.body.projeto);
        console.log('✅ Dados do projeto parseados com sucesso:', projetoData);
      } catch (parseError) {
        console.log('❌ Erro ao fazer parse dos dados do projeto:', parseError);
        return res.status(400).json({ error: 'Dados do projeto inválidos' });
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

      // Criar projeto primeiro
      const projetoCriado = await projModel.criar(projetoData);
      
      // Atualizar projeto com informações do arquivo
      const arquivoData = {
        pdf_filename: pdfFile.filename,
        pdf_original_name: pdfFile.originalname,
        pdf_path: pdfFile.path
      };

      await projModel.atualizarArquivo(projetoCriado.insertId, arquivoData);
      
      console.log('✅ Projeto criado com sucesso:', projetoCriado);
      
      res.status(201).json({
        message: 'Projeto criado com PDF com sucesso!',
        projeto: {
          id: projetoCriado.insertId,
          ...projetoData,
          ...arquivoData
        },
        pdf_info: {
          filename: pdfFile.filename,
          originalname: pdfFile.originalname,
          size: pdfFile.size
        }
      });
    } catch (error) {
      console.error('❌ Erro ao criar projeto com PDF:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Novo método: atualizar projeto com PDF
  async atualizarComPDF(req, res) {
    try {
      const { id } = req.params;
      console.log('📥 Recebendo requisição para atualizar projeto com PDF, ID:', id);

      if (!req.body.projeto) {
        return res.status(400).json({ error: 'Dados do projeto não encontrados' });
      }

      let projetoData;
      try {
        projetoData = JSON.parse(req.body.projeto);
      } catch (parseError) {
        return res.status(400).json({ error: 'Dados do projeto inválidos' });
      }

      const pdfFile = req.file;

      if (!pdfFile) {
        return res.status(400).json({ error: 'Nenhum arquivo PDF foi enviado' });
      }

      // Verificar se o projeto existe
      const projetoExistente = await projModel.buscar(id);
      if (!projetoExistente || projetoExistente.length === 0) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      // Atualizar dados do projeto
      await projModel.atualizar(projetoData, id);

      // Atualizar informações do arquivo
      const arquivoData = {
        pdf_filename: pdfFile.filename,
        pdf_original_name: pdfFile.originalname,
        pdf_path: pdfFile.path
      };

      await projModel.atualizarArquivo(id, arquivoData);
      
      res.status(200).json({
        message: 'Projeto atualizado com PDF com sucesso!',
        projeto: {
          id: parseInt(id),
          ...projetoData,
          ...arquivoData
        },
        pdf_info: {
          filename: pdfFile.filename,
          originalname: pdfFile.originalname,
          size: pdfFile.size
        }
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar projeto com PDF:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Método para download de PDF
  async downloadPDF(req, res) {
    try {
      const { id } = req.params;
      console.log('📥 Recebendo requisição para download de PDF do projeto ID:', id);
      
      const projetos = await projModel.buscarComArquivo(id);
      console.log(' Resultado da busca:', projetos);

      if (!projetos || projetos.length === 0) {
        console.log('❌ Projeto não encontrado');
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      const projeto = projetos[0];
      console.log('📄 Dados do projeto:', projeto);

      if (!projeto.pdf_filename) {
        console.log('❌ PDF não encontrado para este projeto');
        return res.status(404).json({ error: 'PDF não encontrado para este projeto' });
      }

      const filePath = path.join(__dirname, '../assets/uploads', projeto.pdf_filename);
      console.log(' Caminho do arquivo:', filePath);

      if (!fs.existsSync(filePath)) {
        console.log('❌ Arquivo PDF não encontrado no servidor');
        return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
      }

      console.log('✅ Arquivo encontrado, enviando...');
      res.download(filePath, projeto.pdf_original_name || projeto.pdf_filename);
    } catch (error) {
      console.error('❌ Erro ao fazer download do PDF:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Método para visualizar PDF
  async visualizarPDF(req, res) {
    try {
      const { id } = req.params;
      const projetos = await projModel.buscarComArquivo(id);

      if (!projetos || projetos.length === 0) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      const projeto = projetos[0];

      if (!projeto.pdf_filename) {
        return res.status(404).json({ error: 'PDF não encontrado para este projeto' });
      }

      const filePath = path.join(__dirname, '../assets/uploads', projeto.pdf_filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
      }

      // Configurar headers para visualização no navegador
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=' + (projeto.pdf_original_name || projeto.pdf_filename));
      
      // Enviar o arquivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new projController();
