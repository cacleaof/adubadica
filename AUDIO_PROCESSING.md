# Sistema de Processamento de Áudio

Este sistema converte automaticamente arquivos de áudio em texto usando OpenAI Whisper e salva os resultados no banco de dados.

## Funcionalidades

- ✅ Processamento em fila (um arquivo por vez)
- ✅ Monitoramento automático da pasta de áudio
- ✅ Conversão de áudio para texto usando OpenAI Whisper
- ✅ Salvamento do texto no banco de dados
- ✅ API REST para controle do processamento
- ✅ Suporte a arquivos WAV e MP3

## Estrutura de Pastas

```
public/assets/
├── audio/          # Arquivos de áudio para processar
└── texto/          # Arquivos de texto gerados
```

## Configuração

### 1. Variável de Ambiente

Adicione sua chave da API OpenAI ao arquivo `.env`:

```env
OPENAI_API_KEY=sua-chave-api-aqui
```

### 2. Dependências

O sistema requer as seguintes dependências:

```bash
npm install openai fs-extra
```

## Como Funciona

### 1. Monitoramento Automático

O sistema monitora automaticamente a pasta `public/assets/audio` e processa novos arquivos quando detectados.

### 2. Processamento em Fila

- Arquivos são processados um por vez
- Cada arquivo é convertido para texto usando OpenAI Whisper
- O texto é salvo em `public/assets/texto/`
- O caminho do arquivo de texto é salvo na tabela `task` na coluna `texto`

### 3. Banco de Dados

O sistema atualiza a tabela `task` com:
- `texto`: Conteúdo transcrito do áudio
- `texto_arquivo`: Nome do arquivo de texto gerado

## API Endpoints

### Iniciar Processamento
```http
POST /api/audio/iniciar
```

### Processar Arquivo Específico
```http
POST /api/audio/processar/:filename
```

### Listar Arquivos de Áudio
```http
GET /api/audio/arquivos
```

### Obter Status da Fila
```http
GET /api/audio/status
```

### Baixar Arquivo de Texto
```http
GET /api/audio/texto/:filename
```

### Limpar Arquivos Processados
```http
DELETE /api/audio/limpar
```

## Exemplos de Uso

### 1. Iniciar Processamento
```bash
curl -X POST http://localhost:3000/api/audio/iniciar
```

### 2. Processar Arquivo Específico
```bash
curl -X POST http://localhost:3000/api/audio/processar/audio_123.wav
```

### 3. Verificar Status
```bash
curl http://localhost:3000/api/audio/status
```

### 4. Listar Arquivos
```bash
curl http://localhost:3000/api/audio/arquivos
```

## Fluxo de Processamento

1. **Detecção**: Sistema detecta novo arquivo de áudio
2. **Fila**: Arquivo é adicionado à fila de processamento
3. **Transcrição**: OpenAI Whisper converte áudio para texto
4. **Salvamento**: Texto é salvo em arquivo e banco de dados
5. **Atualização**: Tabela `task` é atualizada com o texto

## Logs do Sistema

O sistema gera logs detalhados:

```
🎧 Iniciando monitoramento de pasta de áudio...
📁 Encontrados 2 arquivos de áudio
🎵 Adicionando arquivo à fila: audio_123.wav
🔄 Iniciando processamento da fila. 1 arquivos pendentes
🎤 Processando arquivo: audio_123.wav
🎙️ Iniciando transcrição: /path/to/audio_123.wav
✅ Transcrição concluída: Olá, este é um teste...
📝 Texto salvo em: /path/to/texto/audio_123.txt
✅ Tarefa 1 atualizada com texto
✅ Processamento concluído para: audio_123.wav
```

## Tratamento de Erros

- Arquivos não encontrados são ignorados
- Erros de transcrição são logados mas não interrompem a fila
- Falhas de rede são tratadas com retry automático
- Logs detalhados para debug

## Limitações

- Tamanho máximo de arquivo: 50MB
- Formatos suportados: WAV, MP3
- Idioma: Português (configurável)
- Processamento sequencial (não paralelo)

## Monitoramento

Use os endpoints da API para monitorar:
- Status da fila
- Arquivos processados
- Erros de processamento
- Performance do sistema

## Troubleshooting

### Problema: Arquivo não é processado
- Verificar se o arquivo está na pasta correta
- Verificar logs do sistema
- Verificar se a API key está configurada

### Problema: Erro de transcrição
- Verificar qualidade do áudio
- Verificar formato do arquivo
- Verificar logs de erro

### Problema: Banco não atualizado
- Verificar conexão com banco
- Verificar se a tarefa existe
- Verificar logs de erro
