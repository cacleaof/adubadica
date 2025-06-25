const conexao = require('./conexao');
const tabelas = require('./criar_tabelas');

let bancoInicializado = false;
let inicializacaoEmAndamento = false;

async function inicializarBanco() {
    if (bancoInicializado) return true;
    
    if (inicializacaoEmAndamento) {
        // Aguarda a inicialização em andamento
        while (inicializacaoEmAndamento) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return bancoInicializado;
    }
    
    inicializacaoEmAndamento = true;
    
    try {
        await tabelas.init(conexao);
        console.log('Banco de dados inicializado com sucesso!');
        bancoInicializado = true;
        return true;
    } catch (erro) {
        console.error('Erro ao inicializar banco de dados:', erro);
        return false;
    } finally {
        inicializacaoEmAndamento = false;
    }
}

module.exports = { inicializarBanco }; 