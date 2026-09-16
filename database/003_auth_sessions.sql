-- Ejecutar una vez en el SQL Editor de Supabase antes de arrancar el backend.
-- No cambia ni elimina clientes, comentarios ni las muestras faciales existentes.
CREATE TABLE IF NOT EXISTS public.auth_sessions (
    token_hash TEXT PRIMARY KEY,
    usuario_email TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('session', 'face_challenge')),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON public.auth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS public.auth_login_limits (
    key TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL,
    window_start TIMESTAMPTZ NOT NULL
);
-- Acceso únicamente mediante la conexión privada del backend, no por Data API.
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_login_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_sessions, public.auth_login_limits FROM anon, authenticated;
