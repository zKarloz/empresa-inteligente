# Dashboard empresarial - Grupo 1 - Semestre IV

## Antes de empezar

**Tener instalado los siguientes programas para estre proyecto:** Git, Node.js, PostgreSQL y Visual Studio Code.

**Servicios en la nube que se usarán:** Vercel (Para frontend), Render (Para backend) y Supabase (Para BD).

**Recomendaciones:** Instalar extensiones: Material Icon Theme, Error Lens y Live Share.

## Instrucciones para trabajar localmente

1. Clonar repositorio en su PC:
- `git clone https://github.com/zKarloz/empresa-inteligente.git`

2. Abrir el repositorio clonado en Visual Studio Code

3. Abrir la terminal (usar Git Bash o Command Prompt)

4. Escribir en la terminal este código, para entrar a la **carpeta frontend**:
- `cd frontend`

5. Dentro de la **carpeta frontend**, instalar los *node_modules* (esto suele tardar unos minutos):
- `npm ci`

6. Una vez instalado los *node_modules*, iniciar el servidor para interactuar con la página web:
- `npm run dev`

PARA BACKEND:

1. Entrar a backend
`cd backend`

2. Crear el entorno virtual de Python
`python -m venv .venv`

3. Activar el entorno virtual de Python
`source .venv/Scripts/activate` (En Git Bash)

4. Instalar las librerías necesarias para el correcto funcionamiento del proyecto
`pip install -r requirements.txt`

5. Instalar NTLK
`python -m nltk.downloader punkt_tab stopwords`

6. Ejecutar el servidor
`python -m uvicorn app.main:app --reload`
`uvicorn app.main:app --reload`

> [!NOTE]
> Si te salió algún error consúltame para ayudarte, normal te respondo.
> Por favor, todos deben tener el repositorio en su PC corriendo sin problemas.
