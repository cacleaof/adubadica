class tabelas {
    init(conexao) {
        this.conexao = conexao;
        return this.criarTabelas();
    }

    async criarTabelas() {
        const tabelas = [
            {
                nome: 'despesa',
                sql: `CREATE TABLE IF NOT EXISTS despesa (
                    id INT NOT NULL AUTO_INCREMENT,
                    nome VARCHAR(100) NOT NULL,
                    imagem VARCHAR(256),
                    descricao VARCHAR(100),
                    valor DECIMAL(10, 2),
                    CD VARCHAR(1),
                    tipo VARCHAR(10),
                    venc DATE,
                    pago BOOLEAN DEFAULT FALSE,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                )`
            },
            {
                nome: 'task',
                sql: `CREATE TABLE IF NOT EXISTS task (
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
                    PRIMARY KEY (id)
                )`
            },
            {
                nome: 'cultura',
                sql: `CREATE TABLE IF NOT EXISTS cultura (
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
                )`
            },
            {
                nome: 'user',
                sql: `CREATE TABLE IF NOT EXISTS user (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100),
                    cpf VARCHAR(11),
                    tipo VARCHAR(1),
                    password VARCHAR(20),
                    phone VARCHAR(15),
                    datanascimento VARCHAR(8),
                    PRIMARY KEY (id)
                )`
            },
            {
                nome: 'proj',
                sql: `CREATE TABLE IF NOT EXISTS proj (
                    id INT NOT NULL AUTO_INCREMENT,
                    nome VARCHAR(100) NOT NULL,
                    descricao VARCHAR(255),
                    tipo VARCHAR(10),
                    uid INT,
                    data DATE,
                    status VARCHAR(10),
                    prioridade INT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                )`
            }
        ];

        try {
            // Executa todas as criações de tabelas em paralelo para maior velocidade
            const promises = tabelas.map(async (tabela) => {
                try {
                    await this.conexao.query(tabela.sql);
                    console.log(`Tabela ${tabela.nome} criada/verificada com sucesso!`);
                } catch (erro) {
                    console.error(`Erro ao criar tabela ${tabela.nome}:`, erro);
                    throw erro;
                }
            });

            await Promise.all(promises);
            console.log('Todas as tabelas foram criadas/verificadas com sucesso!');
        } catch (erro) {
            console.error('Erro ao criar tabelas:', erro);
            throw erro;
        }
    }
}

module.exports = new tabelas();