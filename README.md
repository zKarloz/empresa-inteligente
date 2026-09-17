# Dashboard empresarial - Grupo 1 - Semestre IV

## Antes de empezar

**Tener instalado los siguientes programas para estre proyecto:** Git, Node.js, PostgreSQL y Visual Studio Code.

**Servicios en la nube que se usarán:** Vercel (Para frontend), Render (Para backend) y Supabase (Para BD).

**Recomendaciones:** Instalar extensiones: Material Icon Theme, Error Lens y Live Share.

# Instrucciones para trabajar localmente

## Frontend: configuración inicial

### 1. Clonar repositorio en su PC

```bash
`git clone https://github.com/zKarloz/empresa-inteligente.git`
```

### 2. Abrir el repositorio clonado en Visual Studio Code

### 3. Abrir la terminal (usar Git Bash o Command Prompt)

### 4. Escribir en la terminal este código, para entrar a la **carpeta frontend**

```bash
`cd frontend`
```

### 5. Dentro de la **carpeta frontend**, instalar los _node_modules_ (esto suele tardar unos minutos)

```bash
`npm ci`
```

### 6. Una vez instalado los _node_modules_, iniciar el servidor para interactuar con la página web

```bash
`npm run dev`
```

## Backend: configuración inicial

Abre una segunda terminal desde la raíz del proyecto.

### 1. Entrar a backend

```bash
cd backend
```

### 2. Crear el entorno virtual

```bash
python -m venv .venv
```

Este paso se realiza al preparar el proyecto por primera vez.

### 3. Activar el entorno virtual

En Git Bash:

```bash
source .venv/Scripts/activate
```

En Command Prompt (CMD):

```bat
.venv\Scripts\activate.bat
```

Utiliza solamente el comando correspondiente a tu terminal.

### 4. Instalar las dependencias

```bash
python -m pip install -r requirements.txt
```

Esto instala las librerías del backend dentro de `.venv`.
Repite este paso cuando cambie `requirements.txt`.

### 5. Configurar las variables de entorno

Crea el archivo `.env` dentro de `backend` con la configuración
acordada por el equipo, incluida `DATABASE_URL`.

Las credenciales deben compartirse por un medio privado.
No subir `.env` al repositorio.

### 6. Descargar los recursos de NLTK

Con el entorno virtual activado, ejecuta:

```bash
python -m nltk.downloader punkt_tab stopwords
```

Este comando descarga los recursos necesarios para tokenizar
texto en español y filtrar palabras vacías.

Normalmente basta con ejecutarlo una vez por usuario y equipo.
No es necesario repetirlo al iniciar el servidor ni después de
cada `git pull`, siempre que los recursos continúen disponibles.

Si aparece un error indicando que falta `punkt_tab` o `stopwords`,
vuelve a ejecutar el comando.

### 7. Iniciar el backend

```bash
python -m uvicorn app.main:app --reload
```

Swagger estará disponible en:

http://127.0.0.1:8000/docs

## Para volver a trabajar otro día

No necesitas volver a crear el entorno virtual.

Activa `.venv` e inicia FastAPI en una terminal.
En otra terminal, entra a `frontend` y ejecuta `npm run dev`.

# Estructura del proyecto (Última modificación: 1:56 AM - 15/09/2026)

```
empresa-inteligente-Carlos
├─ backend
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth.py
│  │  │  ├─ biometria.py
│  │  │  ├─ clientes.py
│  │  │  ├─ comentarios.py
│  │  │  ├─ dashboard.py
│  │  │  ├─ metricas.py
│  │  │  ├─ nltk.py
│  │  │  ├─ scipy.py
│  │  │  ├─ tiempos_atencion.py
│  │  │  └─ __init__.py
│  │  ├─ core
│  │  │  ├─ config.py
│  │  │  └─ security.py
│  │  ├─ database
│  │  │  ├─ base.py
│  │  │  ├─ connection.py
│  │  │  ├─ models.py
│  │  │  └─ __init__.py
│  │  ├─ main.py
│  │  ├─ models
│  │  │  ├─ analisis_nlp.py
│  │  │  ├─ cliente.py
│  │  │  ├─ comentario.py
│  │  │  ├─ optimizacion.py
│  │  │  ├─ tiempo_atencion.py
│  │  │  └─ __init__.py
│  │  ├─ schemas
│  │  │  ├─ biometria.py
│  │  │  ├─ cliente.py
│  │  │  ├─ comentario.py
│  │  │  ├─ dashboard.py
│  │  │  ├─ metrica.py
│  │  │  ├─ nlp.py
│  │  │  ├─ tiempo_atencion.py
│  │  │  └─ __init__.py
│  │  └─ services
│  │     ├─ biometria_service.py
│  │     ├─ comentario_nlp_service.py
│  │     ├─ datos_nlp.py
│  │     ├─ nltk_service.py
│  │     ├─ scipy_service.py
│  │     └─ __init__.py
│  ├─ requirements.txt
│  └─ scripts
│     ├─ evaluar_metricas.py
│     ├─ evaluar_nlp.py
│     ├─ generar_password_hash.py
│     └─ migrar_administrador.py
├─ database
│  ├─ 001_schema.sql
│  ├─ 002_seed.sql
│  ├─ 003_auth_sessions.sql
│  └─ 004_usuarios.sql
├─ docker-compose.yml
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ CambiarPassword.tsx
│  │  │  ├─ FaceLogin.tsx
│  │  │  ├─ FaceRecognition.tsx
│  │  │  ├─ GestionUsuarios.tsx
│  │  │  ├─ GraficaInterpolacion.tsx
│  │  │  ├─ Loading.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  └─ Sidebar.tsx
│  │  ├─ hooks
│  │  │  └─ useCamaraFacial.ts
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  └─ DashboardLayout.tsx
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ AnalisisNLP.tsx
│  │  │  ├─ Atencion.tsx
│  │  │  ├─ Clientes.tsx
│  │  │  ├─ Comentarios.tsx
│  │  │  ├─ Configuracion.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ LandingPage.tsx
│  │  │  ├─ Login.tsx
│  │  │  ├─ Metricas.tsx
│  │  │  ├─ Optimizacion.tsx
│  │  │  └─ Reportes.tsx
│  │  ├─ routes
│  │  │  └─ AppRoutes.tsx
│  │  └─ services
│  │     ├─ api.ts
│  │     ├─ auth.ts
│  │     ├─ biometria.ts
│  │     ├─ clientes.ts
│  │     ├─ comentarios.ts
│  │     ├─ dashboard.ts
│  │     ├─ facialRecognition.ts
│  │     ├─ nlp.ts
│  │     ├─ nltk.ts
│  │     ├─ scipy.ts
│  │     └─ tiempoAtencion.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vercel.json
│  └─ vite.config.ts
└─ README.md

```
