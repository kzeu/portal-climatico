CREATE TABLE IF NOT EXISTS biblioteca (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT,
  data TEXT,
  link TEXT,
  pagina TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  arquivo TEXT,
  nome_arquivo TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  pagina TEXT,
  titulo TEXT,
  conteudo TEXT,
  link TEXT,
  tipo_link TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  imagem_card TEXT,
  pagina_detalhe BOOLEAN NOT NULL DEFAULT FALSE,
  titulo_pagina TEXT,
  texto_pagina TEXT,
  data_publicacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  origem TEXT
);

CREATE TABLE IF NOT EXISTS paginas (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES cards (id) ON DELETE CASCADE,
  titulo TEXT,
  texto TEXT,
  data_publicacao TEXT
);

CREATE TABLE IF NOT EXISTS paginas_imagens (
  id SERIAL PRIMARY KEY,
  pagina_id INTEGER REFERENCES paginas (id) ON DELETE CASCADE,
  imagem TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS banners_herois (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  pagina TEXT NOT NULL,
  pequeno TEXT,
  titulo TEXT NOT NULL,
  texto TEXT,
  imagem TEXT,
  botao_principal TEXT,
  link_principal TEXT,
  tipo_link_principal TEXT DEFAULT 'interno',
  botao_secundario TEXT,
  link_secundario TEXT,
  tipo_link_secundario TEXT DEFAULT 'interno',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  usuario TEXT UNIQUE,
  senha TEXT,
  perfil TEXT
);

CREATE TABLE IF NOT EXISTS clima_indicadores (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT,
  descricao TEXT,
  tipo TEXT,
  arquivo TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS clima_mapas (
  id SERIAL PRIMARY KEY,
  codigo TEXT,
  indicador_id INTEGER REFERENCES clima_indicadores (id) ON DELETE CASCADE,
  periodo TEXT,
  ssp TEXT,
  percentil TEXT,
  campo TEXT,
  arquivo TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS clima_classificacoes (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL,
  classe INTEGER,
  minimo DOUBLE PRECISION,
  maximo DOUBLE PRECISION,
  cor TEXT
);

CREATE TABLE IF NOT EXISTS climate_map_metadata (
  id SERIAL PRIMARY KEY,
  indicator_id INTEGER,
  map_code TEXT,
  geojson_field TEXT,
  variable_full TEXT,
  variable_short TEXT,
  period TEXT,
  scenario TEXT,
  uncertainty TEXT,
  titulo_pt TEXT
);

CREATE TABLE IF NOT EXISTS submissoes_climaticas (
  id SERIAL PRIMARY KEY,
  email TEXT,
  tipo_proponente TEXT,
  nome_responsavel TEXT,
  entidade TEXT,
  cargo TEXT,
  website TEXT,
  tipo_submissao TEXT,
  pagina TEXT,
  idioma TEXT,
  titulo TEXT,
  titulo_curto TEXT,
  descricao TEXT,
  data_publicacao TEXT,
  data_retirada TEXT,
  data_inicio TEXT,
  hora_inicio TEXT,
  data_fim TEXT,
  hora_fim TEXT,
  evento_online BOOLEAN,
  local1 TEXT,
  local2 TEXT,
  link TEXT,
  permissao_publicacao BOOLEAN,
  motivo_publicacao TEXT,
  descricao_documento TEXT,
  tags TEXT,
  destinos_publicacao JSONB,
  config_card JSONB,
  config_biblioteca JSONB,
  status TEXT,
  observacao_admin TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissao_arquivos (
  id SERIAL PRIMARY KEY,
  submissao_id INTEGER REFERENCES submissoes_climaticas (id) ON DELETE CASCADE,
  nome_original TEXT,
  nome_arquivo TEXT,
  caminho TEXT,
  tipo_mime TEXT,
  tamanho INTEGER
);

CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  titulo TEXT,
  titulo_curto TEXT,
  descricao TEXT,
  tipo TEXT,
  data_inicio TEXT,
  hora_inicio TEXT,
  data_fim TEXT,
  hora_fim TEXT,
  evento_online BOOLEAN,
  local1 TEXT,
  local2 TEXT,
  link TEXT,
  entidade TEXT,
  nome_responsavel TEXT,
  email_responsavel TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);
