class   tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarTabelas();
    }

 criarTabelas() {
        const sql = `CREATE TABLE IF NOT EXISTS cultura (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(100) NOT NULL,
            tipo VARCHAR(1),
            N INT,
            P INT,
            K INT,
            C INT,
            FTE INT,
            esterco INT,
            cova VARCHAR(100),
            covaArea VARCHAR(100),
            PRIMARY KEY (id)
        )`;

        const sqlu = `CREATE TABLE IF NOT EXISTS user (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            cpf VARCHAR(11),
            tipo VARCHAR(1),
            password VARCHAR(20),
            phone VARCHAR(15),
            datanascimento VARCHAR(8),
            PRIMARY KEY (id)
        )`;
  const sqlf = `CREATE TABLE IF NOT EXISTS despesa (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(100) NOT NULL,
            descricao VARCHAR(100),
            valor DECIMAL(10, 2),
            CD VARCHAR(1),
            tipo VARCHAR(10),
            venc DATE,
            PRIMARY KEY (id)
        )`;
       this.conexao.query(sqlf, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log('Tabela despesa foi criada com sucesso!');
            }
        });

const sqlt = `CREATE TABLE IF NOT EXISTS task (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(100) NOT NULL,
            descricao VARCHAR(255),
            tipo VARCHAR(10),
            uid INT,
            proj VARCHAR(100),
            data DATE,
            status VARCHAR(10),
            prioridade INT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (uid) REFERENCES user(id)
        )`;
          this.conexao.query(sqlt, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log('Tabela task criada com sucesso!');
            }
        });
          this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log('Tabela cultura criada com sucesso!');
            }
        });
         this.conexao.query(sqlu, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log('Tabela user criada com sucesso!');
            }
        });

    }
}
module.exports = new tabelas();