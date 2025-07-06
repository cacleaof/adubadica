# Endpoints de Projetos com Dependências

## Visão Geral

O sistema agora suporta hierarquia de projetos através do campo `dep` (dependência) na tabela `proj`. Este campo armazena o ID do projeto pai/dependente.

## Endpoints Disponíveis

### 1. Buscar Projetos Dependentes
**GET** `/api/proj/:id/dependentes`

Busca todos os projetos que dependem do projeto especificado.

**Exemplo:**
```bash
GET /api/proj/1/dependentes
```

**Resposta:**
```json
{
  "projeto_id": 1,
  "dependentes": [
    {
      "id": 2,
      "nome": "Subprojeto A",
      "dep": 1,
      "descricao": "Descrição do subprojeto"
    },
    {
      "id": 3,
      "nome": "Subprojeto B", 
      "dep": 1,
      "descricao": "Outro subprojeto"
    }
  ],
  "total_dependentes": 2
}
```

### 2. Buscar Projeto Pai
**GET** `/api/proj/:id/projeto-pai`

Busca o projeto pai de um projeto dependente.

**Exemplo:**
```bash
GET /api/proj/2/projeto-pai
```

**Resposta:**
```json
{
  "projeto_dependente_id": 2,
  "projeto_pai": {
    "id": 1,
    "nome": "Projeto Principal",
    "dep": null,
    "descricao": "Descrição do projeto principal"
  }
}
```

### 3. Buscar Todos os Projetos com Dependências
**GET** `/api/projs-com-dependencias`

Busca todos os projetos incluindo informações sobre suas dependências.

**Exemplo:**
```bash
GET /api/projs-com-dependencias
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Projeto Principal",
    "dep": null,
    "descricao": "Projeto raiz",
    "projeto_dependente_nome": null,
    "projeto_dependente_id": null
  },
  {
    "id": 2,
    "nome": "Subprojeto A",
    "dep": 1,
    "descricao": "Subprojeto do projeto principal",
    "projeto_dependente_nome": "Projeto Principal",
    "projeto_dependente_id": 1
  }
]
```

### 4. Buscar Projetos Raiz
**GET** `/api/projs-raiz`

Busca apenas os projetos que não têm dependências (projetos raiz).

**Exemplo:**
```bash
GET /api/projs-raiz
```

**Resposta:**
```json
{
  "projetos_raiz": [
    {
      "id": 1,
      "nome": "Projeto Principal",
      "dep": null,
      "descricao": "Projeto raiz"
    }
  ],
  "total_projetos_raiz": 1
}
```

### 5. Buscar Árvore de Dependências
**GET** `/api/proj/:id/arvore-dependencias`

Busca toda a árvore de dependências de um projeto específico.

**Exemplo:**
```bash
GET /api/proj/1/arvore-dependencias
```

**Resposta:**
```json
{
  "projeto_raiz_id": 1,
  "arvore_dependencias": [
    {
      "id": 1,
      "nome": "Projeto Principal",
      "dep": null,
      "nivel": 0
    },
    {
      "id": 2,
      "nome": "Subprojeto A",
      "dep": 1,
      "nivel": 1
    },
    {
      "id": 3,
      "nome": "Sub-subprojeto",
      "dep": 2,
      "nivel": 2
    }
  ],
  "total_niveis": 3
}
```

### 6. Validar Dependência Circular
**POST** `/api/proj/:id/validar-dependencia`

Valida se uma dependência não criaria um ciclo na hierarquia.

**Exemplo:**
```bash
POST /api/proj/1/validar-dependencia
Content-Type: application/json

{
  "dep_id": 2
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Dependência válida",
  "projeto_id": 1,
  "projeto_dependente_id": 2
}
```

**Resposta de Erro (Dependência Circular):**
```json
{
  "error": "Dependência circular detectada",
  "message": "Esta dependência criaria um ciclo na hierarquia de projetos"
}
```

## Estrutura da Tabela

A tabela `proj` agora inclui o campo `dep`:

```sql
CREATE TABLE proj (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  dep INT,  -- ID do projeto dependente (pode ser NULL para projetos raiz)
  -- outros campos...
  FOREIGN KEY (dep) REFERENCES proj(id) ON DELETE SET NULL
);
```

## Casos de Uso

### 1. Criar Projeto Raiz
```javascript
const projetoRaiz = {
  nome: "Projeto Principal",
  descricao: "Projeto sem dependências",
  dep: null  // ou omitir o campo
};
```

### 2. Criar Projeto Dependente
```javascript
const projetoDependente = {
  nome: "Subprojeto",
  descricao: "Depende do projeto principal",
  dep: 1  // ID do projeto pai
};
```

### 3. Atualizar Dependência
```javascript
// Tornar um projeto independente
PUT /api/proj/2
{
  "dep": null
}

// Alterar dependência
PUT /api/proj/2
{
  "dep": 3
}
```

## Validações Implementadas

1. **Dependência Circular**: Um projeto não pode depender de si mesmo
2. **Dependência em Cascata**: Um projeto não pode depender de um projeto que já depende dele
3. **Existência do Projeto Pai**: O projeto dependente deve existir
4. **Integridade Referencial**: Se um projeto pai for deletado, os projetos dependentes ficam sem pai

## Exemplo de Hierarquia

```
Projeto Principal (ID: 1, dep: null)
├── Subprojeto A (ID: 2, dep: 1)
│   ├── Sub-subprojeto X (ID: 4, dep: 2)
│   └── Sub-subprojeto Y (ID: 5, dep: 2)
└── Subprojeto B (ID: 3, dep: 1)
    └── Sub-subprojeto Z (ID: 6, dep: 3)
```

## Tratamento de Erros

### Projeto não encontrado
```json
{
  "error": "Projeto pai não encontrado",
  "message": "Este projeto não possui um projeto pai ou o projeto pai foi removido"
}
```

### Dependência inválida
```json
{
  "error": "Dependência circular detectada",
  "message": "Um projeto não pode depender de si mesmo"
}
``` 