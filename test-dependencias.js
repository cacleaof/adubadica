const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testarDependencias() {
    console.log('🧪 Testando funcionalidades de dependências de projetos...\n');

    try {
        // 1. Criar projetos de teste
        console.log('1. Criando projetos de teste...');
        
        const projetoRaiz = await axios.post(`${BASE_URL}/proj`, {
            nome: 'Projeto Principal',
            descricao: 'Projeto raiz sem dependências'
        });
        console.log('✅ Projeto raiz criado:', projetoRaiz.data);

        const subprojeto1 = await axios.post(`${BASE_URL}/proj`, {
            nome: 'Subprojeto A',
            descricao: 'Depende do projeto principal',
            dep: projetoRaiz.data.insertId
        });
        console.log('✅ Subprojeto A criado:', subprojeto1.data);

        const subprojeto2 = await axios.post(`${BASE_URL}/proj`, {
            nome: 'Subprojeto B',
            descricao: 'Também depende do projeto principal',
            dep: projetoRaiz.data.insertId
        });
        console.log('✅ Subprojeto B criado:', subprojeto2.data);

        const subSubprojeto = await axios.post(`${BASE_URL}/proj`, {
            nome: 'Sub-subprojeto',
            descricao: 'Depende do subprojeto A',
            dep: subprojeto1.data.insertId
        });
        console.log('✅ Sub-subprojeto criado:', subSubprojeto.data);

        // 2. Testar buscar dependentes
        console.log('\n2. Testando busca de dependentes...');
        const dependentes = await axios.get(`${BASE_URL}/proj/${projetoRaiz.data.insertId}/dependentes`);
        console.log('✅ Dependentes do projeto raiz:', dependentes.data);

        // 3. Testar buscar projeto pai
        console.log('\n3. Testando busca de projeto pai...');
        const projetoPai = await axios.get(`${BASE_URL}/proj/${subprojeto1.data.insertId}/projeto-pai`);
        console.log('✅ Projeto pai do subprojeto A:', projetoPai.data);

        // 4. Testar buscar projetos com dependências
        console.log('\n4. Testando busca de projetos com dependências...');
        const projetosComDep = await axios.get(`${BASE_URL}/projs-com-dependencias`);
        console.log('✅ Projetos com dependências:', projetosComDep.data);

        // 5. Testar buscar projetos raiz
        console.log('\n5. Testando busca de projetos raiz...');
        const projetosRaiz = await axios.get(`${BASE_URL}/projs-raiz`);
        console.log('✅ Projetos raiz:', projetosRaiz.data);

        // 6. Testar buscar árvore de dependências
        console.log('\n6. Testando busca de árvore de dependências...');
        const arvore = await axios.get(`${BASE_URL}/proj/${projetoRaiz.data.insertId}/arvore-dependencias`);
        console.log('✅ Árvore de dependências:', arvore.data);

        // 7. Testar validação de dependência circular
        console.log('\n7. Testando validação de dependência circular...');
        try {
            const validacao = await axios.post(`${BASE_URL}/proj/${projetoRaiz.data.insertId}/validar-dependencia`, {
                dep_id: subprojeto1.data.insertId
            });
            console.log('✅ Validação de dependência:', validacao.data);
        } catch (error) {
            console.log('❌ Erro esperado na validação:', error.response.data);
        }

        console.log('\n🎉 Todos os testes concluídos com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante os testes:', error.response?.data || error.message);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    testarDependencias();
}

module.exports = testarDependencias; 