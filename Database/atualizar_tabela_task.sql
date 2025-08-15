-- Script para adicionar colunas de texto na tabela task
-- Execute este script no seu banco de dados MySQL

-- Adicionar coluna para o texto transcrito
ALTER TABLE task ADD COLUMN texto TEXT NULL COMMENT 'Texto transcrito do áudio';

-- Adicionar coluna para o nome do arquivo de texto
ALTER TABLE task ADD COLUMN texto_arquivo VARCHAR(255) NULL COMMENT 'Nome do arquivo de texto gerado';

-- Verificar se as colunas foram adicionadas
DESCRIBE task;
