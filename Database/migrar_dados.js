class dados {
  async init(conexao) {
    this.conexao = conexao;
    await this.incluirDados();
  }

  async incluirDados() {
    try {
      const incluirU = "INSERT INTO user(name, tipo, email, cpf, password, phone, datanascimento) VALUES ('carlos leao', 'A', 'cacleaof@gmail.com', '68631839434', '1234', '081994254405', '07-05-67')," +
        "('ada almeida', 'A', 'adaalmeida@hotmail.com', '96105097468', '1234', '081992059813', '25-01-68')";
      await this.conexao.query(incluirU);
      console.log('Dados de usuários criados com sucesso!');

      const incluirT = "INSERT INTO task(nome, descricao, tipo, uid, proj, data, status, prioridade)" +
        "VALUES ('Consorcio', 'Analisar consorcio para compra de carro para Caio', 'Casa', 1, 'Carro_Caio', '2025-05-25', 'toDo', 10)";
      await this.conexao.query(incluirT);
      console.log('Dados de tarefas criados com sucesso!');

      const incluirF = "INSERT INTO despesa SET nome='Qualicoorp', descricao='Plano de Saude', valor=3600.00, CD='D', tipo='Familia', venc='2025-05-29'";
      await this.conexao.query(incluirF);
      console.log('Dados de despesas criados com sucesso!');

      const incluir = "INSERT INTO cultura(nome, tipo, N, P, K, C, FTE, esterco, cova, covaArea) VALUES ('Maracuja', 'p', 45, 45, 60, 2000, 20, 10, '40x40x40', '64')," +
        "('Açai', 'p', 0, 36, 30, 1000, 20, 10, '40x40x40', '64'), ('Café Conilon', 'p', 0, 36, 30, 2000, 10, 20, '40x40x40', '64')";
      await this.conexao.query(incluir);
      console.log('Dados de culturas criados com sucesso!');

    } catch (erro) {
      console.error('Erro ao incluir dados:', erro);
      throw erro;
    }
  }
}

module.exports = new dados();