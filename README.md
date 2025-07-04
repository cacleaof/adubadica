# API Adubadica

## Deploy no Vercel

### Configurações Otimizadas

Este projeto foi otimizado para funcionar no Vercel com as seguintes melhorias:

1. **Timeout aumentado para 60 segundos**
2. **Connection pooling otimizado**
3. **Inicialização de banco de dados em paralelo**
4. **Tratamento de erro melhorado**
5. **Queries com timeout**

### Troubleshooting

Se você encontrar timeout no Vercel:

1. Verifique se o banco de dados está acessível
2. Teste a conexão localmente primeiro
3. Verifique os logs no Vercel Dashboard
4. Considere usar um banco de dados mais próximo da região do Vercel

### Endpoints

- `GET /api/tasks` - Listar todas as tasks
- `GET /api/task/:id` - Buscar task específica
- `POST /api/task` - Criar nova task
- `PUT /api/task/:id` - Atualizar task
- `DELETE /api/task/:id` - Deletar task

### Teste de Conexão

- `GET /api/test` - Teste da API
- `GET /api/db-test` - Teste de conexão com banco
