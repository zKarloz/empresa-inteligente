from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.clientes import router as clientes_router
from app.api.comentarios import router as comentarios_router
from app.api.tiempos_atencion import router as tiempos_router
from app.api.scipy import router as scipy_router
from app.api.nltk import router as nltk_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(title="Empresa Inteligente API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes_router)
app.include_router(comentarios_router)
app.include_router(tiempos_router)
app.include_router(nltk_router)
app.include_router(scipy_router)
app.include_router(dashboard_router)

@app.get("/")
def inicio():
    return {"status": "ok", "message": "API activa y conectada"}