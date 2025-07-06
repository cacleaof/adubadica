const conexao = require('./conexao');

async function atualizarTabelaCultura() {
    try {
        console.log('Atualizando tabela cultura para suportar PDFs...');
        
        // Verificar se os campos já existem
        const [columns] = await conexao.query("SHOW COLUMNS FROM cultura");
        const columnNames = columns.map(col => col.Field);
        
        // Adicionar campos se não existirem
        if (!columnNames.includes('pdf_filename')) {
            await conexao.query("ALTER TABLE cultura ADD COLUMN pdf_filename VARCHAR(255)");
            console.log('Campo pdf_filename adicionado');
        }
        
        if (!columnNames.includes('pdf_original_name')) {
            await conexao.query("ALTER TABLE cultura ADD COLUMN pdf_original_name VARCHAR(255)");
            console.log('Campo pdf_original_name adicionado');
        }
        
        if (!columnNames.includes('pdf_path')) {
            await conexao.query("ALTER TABLE cultura ADD COLUMN pdf_path VARCHAR(500)");
            console.log('Campo pdf_path adicionado');
        }
        
        console.log('Tabela cultura atualizada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao atualizar tabela cultura:', error);
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    atualizarTabelaCultura()
        .then(() => {
            console.log('Processo concluído!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Erro:', error);
            process.exit(1);
        });
}

module.exports = atualizarTabelaCultura; 