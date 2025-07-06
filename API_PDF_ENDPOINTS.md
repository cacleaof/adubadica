# Endpoints de PDF para Cultura

## Endpoints Disponíveis

### 1. Criar Cultura com PDF
**POST** `/api/cultura-with-pdf`

Cria uma nova cultura com um arquivo PDF anexado.

**Formato da requisição:**
- Content-Type: `multipart/form-data`
- Campo `pdf`: arquivo PDF (obrigatório)
- Outros campos da cultura: conforme necessário

**Exemplo de uso (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('pdf', pdfFile); // pdfFile é um objeto File
formData.append('nome', 'Nome da Cultura');
formData.append('descricao', 'Descrição da cultura');

fetch('/api/cultura-with-pdf', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**Resposta de sucesso:**
```json
{
    "message": "Cultura criada com PDF com sucesso!",
    "cultura": {
        "id": 1,
        "nome": "Nome da Cultura",
        "pdf_filename": "pdf-1234567890-123456789.pdf",
        "pdf_original_name": "documento.pdf",
        "pdf_path": "/path/to/file.pdf"
    },
    "pdf_info": {
        "filename": "pdf-1234567890-123456789.pdf",
        "originalname": "documento.pdf",
        "size": 1024000
    }
}
```

### 2. Download de PDF
**GET** `/api/cultura/:id/download-pdf`

Faz o download do PDF associado a uma cultura específica.

**Exemplo de uso:**
```javascript
// Download direto
window.open('/api/cultura/1/download-pdf');

// Ou usando fetch
fetch('/api/cultura/1/download-pdf')
.then(response => response.blob())
.then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.pdf';
    a.click();
});
```

### 3. Visualizar PDF no Navegador
**GET** `/api/cultura/:id/view-pdf`

Abre o PDF diretamente no navegador para visualização.

**Exemplo de uso:**
```javascript
// Abrir em nova aba
window.open('/api/cultura/1/view-pdf', '_blank');

// Ou em iframe
const iframe = document.createElement('iframe');
iframe.src = '/api/cultura/1/view-pdf';
iframe.style.width = '100%';
iframe.style.height = '600px';
document.body.appendChild(iframe);
```

### 4. Listar PDFs Disponíveis
**GET** `/api/pdfs`

Lista todos os PDFs disponíveis no servidor.

**Resposta:**
```json
{
    "pdfs": [
        {
            "filename": "pdf-1234567890-123456789.pdf",
            "size": 1024000,
            "created": "2024-01-01T10:00:00.000Z",
            "modified": "2024-01-01T10:00:00.000Z"
        }
    ]
}
```

## Configurações

### Limites de Upload
- Tamanho máximo: 10MB
- Tipos permitidos: apenas PDF
- Nome do campo: `pdf`

### Estrutura de Pastas
```
assets/
└── uploads/
    └── [arquivos PDF salvos aqui]
```

### Campos Adicionados na Tabela Cultura
- `pdf_filename`: nome do arquivo salvo no servidor
- `pdf_original_name`: nome original do arquivo
- `pdf_path`: caminho completo do arquivo

## Tratamento de Erros

### Erro de Upload
```json
{
    "error": "Apenas arquivos PDF são permitidos!"
}
```

### PDF não encontrado
```json
{
    "error": "PDF não encontrado para esta cultura"
}
```

### Arquivo não encontrado no servidor
```json
{
    "error": "Arquivo PDF não encontrado no servidor"
}
```

## Exemplo Completo de Frontend

```html
<!DOCTYPE html>
<html>
<head>
    <title>Upload de PDF</title>
</head>
<body>
    <form id="uploadForm">
        <input type="file" id="pdfFile" accept=".pdf" required>
        <input type="text" id="nome" placeholder="Nome da Cultura" required>
        <textarea id="descricao" placeholder="Descrição"></textarea>
        <button type="submit">Enviar</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('pdf', document.getElementById('pdfFile').files[0]);
            formData.append('nome', document.getElementById('nome').value);
            formData.append('descricao', document.getElementById('descricao').value);
            
            try {
                const response = await fetch('/api/cultura-with-pdf', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    `<p>Sucesso! ID: ${result.cultura.id}</p>
                     <a href="/api/cultura/${result.cultura.id}/view-pdf" target="_blank">Visualizar PDF</a>
                     <a href="/api/cultura/${result.cultura.id}/download-pdf">Download PDF</a>`;
            } catch (error) {
                document.getElementById('result').innerHTML = `<p>Erro: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
``` 