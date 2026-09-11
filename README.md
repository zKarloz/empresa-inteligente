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

### 5. Dentro de la **carpeta frontend**, instalar los *node_modules* (esto suele tardar unos minutos)

```bash
`npm ci`
```

### 6. Una vez instalado los *node_modules*, iniciar el servidor para interactuar con la página web

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