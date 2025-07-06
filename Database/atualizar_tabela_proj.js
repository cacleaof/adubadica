const conexao = require('./conexao');

async function atualizarTabelaProj() {
    try {
        console.log('🔄 Iniciando atualização da tabela proj...');
        
        // Verificar se os campos já existem
        const [colunas] = await conexao.query("SHOW COLUMNS FROM proj");
        const nomesColunas = colunas.map(col => col.Field);
        
        console.log('📋 Campos existentes na tabela proj:', nomesColunas);
        
        // Alterar a codificação da tabela se necessário
        try {
            await conexao.query("ALTER TABLE proj CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            console.log("✅ Tabela 'proj' alterada para UTF8MB4");
        } catch (erro) {
            console.log("ℹ️ Tabela 'proj' já está com a codificação correta");
        }
        
        const camposParaAdicionar = [
            { 
                nome: 'pdf_filename', 
                sql: 'ALTER TABLE proj ADD COLUMN pdf_filename VARCHAR(255)',
                descricao: 'Nome do arquivo PDF salvo no servidor'
            },
            { 
                nome: 'pdf_original_name', 
                sql: 'ALTER TABLE proj ADD COLUMN pdf_original_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
                descricao: 'Nome original do arquivo PDF enviado pelo usuário'
            },
            { 
                nome: 'pdf_path', 
                sql: 'ALTER TABLE proj ADD COLUMN pdf_path VARCHAR(500)',
                descricao: 'Caminho completo do arquivo PDF no servidor'
            }
        ];

        let camposAdicionados = 0;
        for (const campo of camposParaAdicionar) {
            if (!nomesColunas.includes(campo.nome)) {
                await conexao.query(campo.sql);
                console.log(`✅ Campo ${campo.nome} adicionado à tabela proj (${campo.descricao})`);
                camposAdicionados++;
            } else {
                console.log(`ℹ️ Campo ${campo.nome} já existe na tabela proj`);
            }
        }
        
        if (camposAdicionados === 0) {
            console.log('🎉 Todos os campos já existem na tabela proj!');
        } else {
            console.log(`🎉 ${camposAdicionados} campo(s) adicionado(s) com sucesso!`);
        }
        
        console.log('✅ Atualização da tabela proj concluída!');
        
    } catch (erro) {
        console.error('❌ Erro ao atualizar tabela proj:', erro);
        throw erro;
    } finally {
        // Fechar conexão
        await conexao.end();
    }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
    atualizarTabelaProj()
        .then(() => {
            console.log('🎯 Script de atualização concluído com sucesso!');
            process.exit(0);
        })
        .catch((erro) => {
            console.error('💥 Erro durante a atualização:', erro);
            process.exit(1);
        });
}

module.exports = { atualizarTabelaProj }; 