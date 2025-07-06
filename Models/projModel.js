const conexao = require('../Database/conexao');
    
class projModel {
  async executarQuery(sql, params) {
    try {
      const [resultados] = await conexao.query(sql, params);
      return resultados;
    } catch (erro) {
      throw erro;
    }
  }

  async buscar(id) {
    const sql = 'SELECT * FROM proj WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async buscarTodos() {
    const sql = 'SELECT * FROM proj';
    return this.executarQuery(sql);
  }

  async criar(novoproj) {
    const sql = "INSERT INTO proj SET ?";
    return this.executarQuery(sql, novoproj);
  }
    
  async deletar(id) {
    const sql = 'DELETE FROM proj WHERE id = ?';
    return this.executarQuery(sql, id);
  }

  async atualizar(projAtualizado, id) {
    const sql = 'UPDATE proj SET ? WHERE id = ?';
    return this.executarQuery(sql, [projAtualizado, id]);
  }

  // Novo método: buscar projetos dependentes de um projeto específico
  async buscarDependentes(projId) {
    const sql = 'SELECT * FROM proj WHERE dep = ?';
    return this.executarQuery(sql, projId);
  }

  // Novo método: buscar projeto pai de um projeto dependente
  async buscarProjetoPai(projId) {
    const sql = `
      SELECT p.* 
      FROM proj p 
      INNER JOIN proj dependente ON dependente.dep = p.id 
      WHERE dependente.id = ?
    `;
    return this.executarQuery(sql, projId);
  }

  // Novo método: buscar todos os projetos com suas dependências
  async buscarComDependencias() {
    const sql = `
      SELECT 
        p.*,
        dp.nome as projeto_dependente_nome,
        dp.id as projeto_dependente_id
      FROM proj p
      LEFT JOIN proj dp ON p.dep = dp.id
      ORDER BY p.id
    `;
    return this.executarQuery(sql);
  }

  // Novo método: buscar projetos que não têm dependências (projetos raiz)
  async buscarProjetosRaiz() {
    const sql = 'SELECT * FROM proj WHERE dep IS NULL OR dep = 0';
    return this.executarQuery(sql);
  }

  // Novo método: buscar árvore de dependências de um projeto
  async buscarArvoreDependencias(projId) {
    const sql = `
      WITH RECURSIVE projeto_tree AS (
        SELECT id, nome, dep, 0 as nivel
        FROM proj 
        WHERE id = ?
        
        UNION ALL
        
        SELECT p.id, p.nome, p.dep, pt.nivel + 1
        FROM proj p
        INNER JOIN projeto_tree pt ON p.dep = pt.id
      )
      SELECT * FROM projeto_tree
      ORDER BY nivel, id
    `;
    return this.executarQuery(sql, projId);
  }

  // Novo método: atualizar arquivo do projeto
  async atualizarArquivo(projId, arquivoData) {
    const sql = 'UPDATE proj SET pdf_filename = ?, pdf_original_name = ?, pdf_path = ? WHERE id = ?';
    return this.executarQuery(sql, [arquivoData.pdf_filename, arquivoData.pdf_original_name, arquivoData.pdf_path, projId]);
  }

  // Novo método: buscar projeto com informações do arquivo
  async buscarComArquivo(id) {
    const sql = 'SELECT *, pdf_filename, pdf_original_name, pdf_path FROM proj WHERE id = ?';
    return this.executarQuery(sql, id);
  }
}

module.exports = new projModel();