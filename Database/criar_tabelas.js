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
                    adubatipo VARCHAR(1),
                    tipo VARCHAR(50),
                    N INT,
                    P INT,
                    K INT,
                    C INT,
                    FTE INT,
                    esterco INT,
                    cN INT,
                    cP INT,
                    cK INT,
                    cC INT,
                    cFTE INT,
                    cesterco INT,
                    cova VARCHAR(100),
                    covaArea VARCHAR(100),
                    link VARCHAR(255),
                    pdf_filename VARCHAR(255),
                    pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                    pdf_path VARCHAR(500),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
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
                    fim DATE,
                    status VARCHAR(10),
                    prioridade INT,
                    pdf_filename VARCHAR(255),
                    pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                    pdf_path VARCHAR(500),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
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
            
            // Atualizar tabela cultura existente com novos campos
            await this.atualizarTabelaCultura();
            
            // Atualizar tabela proj existente com novos campos
            await this.atualizarTabelaProj();
            
            console.log('Todas as tabelas foram criadas/verificadas com sucesso!');
        } catch (erro) {
            console.error('Erro ao criar tabelas:', erro);
            throw erro;
        }
    }

    async atualizarTabelaCultura() {
        try {
            // Verificar se os campos já existem
            const [colunas] = await this.conexao.query("SHOW COLUMNS FROM cultura");
            const nomesColunas = colunas.map(col => col.Field);
            
            // Alterar o tamanho da coluna tipo se necessário
            try {
                await this.conexao.query("ALTER TABLE cultura MODIFY COLUMN tipo VARCHAR(50)");
                console.log("✅ Coluna 'tipo' alterada para VARCHAR(50)");
            } catch (erro) {
                console.log("ℹ️ Coluna 'tipo' já está com o tamanho correto ou não existe");
            }
            
            // Alterar a codificação da coluna pdf_original_name
            try {
                await this.conexao.query("ALTER TABLE cultura MODIFY COLUMN pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                console.log("✅ Coluna 'pdf_original_name' alterada para UTF8MB4");
            } catch (erro) {
                console.log("ℹ️ Coluna 'pdf_original_name' já está com a codificação correta ou não existe");
            }
            
            const camposParaAdicionar = [
                { nome: 'adubatipo', sql: 'ALTER TABLE cultura ADD COLUMN adubatipo VARCHAR(1) AFTER nome' },
                { nome: 'cN', sql: 'ALTER TABLE cultura ADD COLUMN cN INT' },
                { nome: 'cP', sql: 'ALTER TABLE cultura ADD COLUMN cP INT' },
                { nome: 'cK', sql: 'ALTER TABLE cultura ADD COLUMN cK INT' },
                { nome: 'cC', sql: 'ALTER TABLE cultura ADD COLUMN cC INT' },
                { nome: 'cFTE', sql: 'ALTER TABLE cultura ADD COLUMN cFTE INT' },
                { nome: 'cesterco', sql: 'ALTER TABLE cultura ADD COLUMN cesterco INT' },
                { nome: 'link', sql: 'ALTER TABLE cultura ADD COLUMN link VARCHAR(255)' },
                { nome: 'pdf_filename', sql: 'ALTER TABLE cultura ADD COLUMN pdf_filename VARCHAR(255)' },
                { nome: 'pdf_original_name', sql: 'ALTER TABLE cultura ADD COLUMN pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci' },
                { nome: 'pdf_path', sql: 'ALTER TABLE cultura ADD COLUMN pdf_path VARCHAR(500)' },
                { nome: 'timestamp', sql: 'ALTER TABLE cultura ADD COLUMN timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
            ];

            for (const campo of camposParaAdicionar) {
                if (!nomesColunas.includes(campo.nome)) {
                    await this.conexao.query(campo.sql);
                    console.log(`✅ Campo ${campo.nome} adicionado à tabela cultura`);
                } else {
                    console.log(`ℹ️ Campo ${campo.nome} já existe na tabela cultura`);
                }
            }
        } catch (erro) {
            console.error('Erro ao atualizar tabela cultura:', erro);
        }
    }

    async atualizarTabelaProj() {
        try {
            // Verificar se os campos já existem
            const [colunas] = await this.conexao.query("SHOW COLUMNS FROM proj");
            const nomesColunas = colunas.map(col => col.Field);
            
            // Alterar a codificação da tabela se necessário
            try {
                await this.conexao.query("ALTER TABLE proj CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                console.log("✅ Tabela 'proj' alterada para UTF8MB4");
            } catch (erro) {
                console.log("ℹ️ Tabela 'proj' já está com a codificação correta");
            }
            
            const camposParaAdicionar = [
                { nome: 'pdf_filename', sql: 'ALTER TABLE proj ADD COLUMN pdf_filename VARCHAR(255)' },
                { nome: 'pdf_original_name', sql: 'ALTER TABLE proj ADD COLUMN pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci' },
                { nome: 'pdf_path', sql: 'ALTER TABLE proj ADD COLUMN pdf_path VARCHAR(500)' }
            ];

            for (const campo of camposParaAdicionar) {
                if (!nomesColunas.includes(campo.nome)) {
                    await this.conexao.query(campo.sql);
                    console.log(`✅ Campo ${campo.nome} adicionado à tabela proj`);
                } else {
                    console.log(`ℹ️ Campo ${campo.nome} já existe na tabela proj`);
                }
            }
        } catch (erro) {
            console.error('Erro ao atualizar tabela proj:', erro);
        }
    }
}

module.exports = new tabelas();