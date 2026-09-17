-- 1. USUARIOS

create table public.usuarios (
  id bigserial not null,
  nombre character varying(150) not null,
  email character varying(200) not null,
  password_hash text not null,
  rol character varying(30) not null default 'usuario'::character varying,
  activo boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint usuarios_pkey primary key (id),
  constraint usuarios_email_key unique (email)
) TABLESPACE pg_default;

-- 2. CLIENTES

create table public.clientes (
  id bigserial not null,
  nombre character varying(150) not null,
  email character varying(200) null,
  telefono character varying(50) null,
  empresa character varying(200) null,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint clientes_pkey primary key (id)
) TABLESPACE pg_default;

-- 3. CATEGORÍAS DE COMENTARIOS

create table public.categorias (
  id bigserial not null,
  nombre character varying(100) not null,
  descripcion text null,
  activo boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint categorias_pkey primary key (id),
  constraint categorias_nombre_key unique (nombre)
) TABLESPACE pg_default;

-- 4. COMENTARIOS DE CLIENTES

create table public.comentarios (
  id bigserial not null,
  cliente_id bigint null,
  contenido text not null,
  canal character varying(30) null default 'web'::character varying,
  estado character varying(30) null default 'pendiente'::character varying,
  categoria character varying(50) null,
  fecha timestamp with time zone null default now(),
  procesado boolean null default false,
  nombre_cliente character varying(150) null,
  apellido_cliente character varying(150) null,
  empresa_cliente character varying(200) null,
  telefono_cliente character varying(30) null,
  correo_cliente character varying(254) null,
  constraint comentarios_pkey primary key (id),
  constraint comentarios_cliente_id_fkey foreign KEY (cliente_id) references clientes (id) on delete set null
) TABLESPACE pg_default;

-- 5. ANÁLISIS NLP

create table public.analisis_nlp (
  id bigserial not null,
  comentario_id bigint not null,
  idioma character varying(20) null default 'es'::character varying,
  cantidad_palabras integer null default 0,
  palabras_limpias jsonb null,
  palabras_frecuentes jsonb null,
  categoria_detectada character varying(100) null,
  confianza numeric(5, 4) null,
  fecha_analisis timestamp with time zone null default now(),
  sentimiento character varying(20) null,
  prioridad character varying(20) null,
  constraint analisis_nlp_pkey primary key (id),
  constraint analisis_nlp_comentario_id_fkey foreign KEY (comentario_id) references comentarios (id) on delete CASCADE
) TABLESPACE pg_default;

-- 6. TIEMPOS DE ATENCIÓN

create table public.tiempos_atencion (
  id bigserial not null,
  cliente_id bigint null,
  comentario_id bigint null,
  tiempo_minutos numeric(10, 2) not null,
  fecha date not null default CURRENT_DATE,
  operador character varying(150) null,
  created_at timestamp with time zone null default now(),
  constraint tiempos_atencion_pkey primary key (id),
  constraint tiempos_atencion_cliente_id_fkey foreign KEY (cliente_id) references clientes (id) on delete set null,
  constraint tiempos_atencion_comentario_id_fkey foreign KEY (comentario_id) references comentarios (id) on delete set null
) TABLESPACE pg_default;

-- 7. MÉTRICAS ESTADÍSTICAS

create table public.metricas_estadisticas (
  id bigserial not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  cantidad_registros integer not null,
  media numeric(12, 4) null,
  mediana numeric(12, 4) null,
  desviacion_estandar numeric(12, 4) null,
  minimo numeric(12, 4) null,
  maximo numeric(12, 4) null,
  percentil_25 numeric(12, 4) null,
  percentil_75 numeric(12, 4) null,
  created_at timestamp with time zone null default now(),
  constraint metricas_estadisticas_pkey primary key (id)
) TABLESPACE pg_default;

-- 8. OPTIMIZACIONES

create table public.optimizaciones (
  id bigserial not null,
  nombre character varying(150) not null,
  descripcion text null,
  parametros_entrada jsonb not null,
  resultado jsonb null,
  costo_inicial numeric(14, 4) null,
  costo_optimizado numeric(14, 4) null,
  estado character varying(30) null default 'pendiente'::character varying,
  created_at timestamp with time zone null default now(),
  constraint optimizaciones_pkey primary key (id)
) TABLESPACE pg_default;

-- 9. AUDITORÍA

create table public.auditoria (
  id bigserial not null,
  usuario_id bigint null,
  accion character varying(100) not null,
  tabla character varying(100) null,
  registro_id bigint null,
  detalles jsonb null,
  ip character varying(45) null,
  created_at timestamp with time zone null default now(),
  constraint auditoria_pkey primary key (id),
  constraint auditoria_usuario_id_fkey foreign KEY (usuario_id) references usuarios (id) on delete set null
) TABLESPACE pg_default;

-- 10. BIOMETRÍA FACIAL

create table public.biometria_facial (
  id bigint generated by default as identity not null,
  usuario_email character varying(255) not null,
  embeddings_encrypted text not null,
  cantidad_muestras smallint not null,
  activo boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint biometria_facial_pkey primary key (id),
  constraint biometria_facial_usuario_email_key unique (usuario_email)
) TABLESPACE pg_default;

create index IF not exists idx_biometria_facial_email on public.biometria_facial using btree (usuario_email) TABLESPACE pg_default;