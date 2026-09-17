"""Configuración del servidor. Ninguna contraseña se envía al frontend."""

import math
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Configura {name} en el entorno del backend")
    return value


# Las credenciales del .env solo se usan en el script de migración inicial.
# Después, cada cuenta se autentica contra su hash guardado en la base de datos.
SESSION_SECONDS = 8 * 60 * 60
CHALLENGE_SECONDS = 2 * 60
MAX_FACE_ATTEMPTS = 5
# Valor experimental; debe evaluarse con capturas reales, no es una probabilidad.
FACE_THRESHOLD = float(os.getenv("FACE_THRESHOLD", "0.65"))
if not math.isfinite(FACE_THRESHOLD) or not 0.5 <= FACE_THRESHOLD <= 1:
    raise RuntimeError("FACE_THRESHOLD debe estar entre 0.5 y 1")
