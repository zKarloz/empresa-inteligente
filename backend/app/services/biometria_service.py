import json
import math
import os

from cryptography.fernet import Fernet, InvalidToken


def obtener_fernet() -> Fernet:
    clave = os.getenv("BIOMETRIC_KEY")
    if not clave:
        raise RuntimeError("BIOMETRIC_KEY no está configurada")
    return Fernet(clave.encode("utf-8"))


# Guardar únicamente descriptores cifrados; no guardar imágenes de la cámara.
def cifrar_embeddings(embeddings: list[list[float]]) -> str:
    fernet = obtener_fernet()
    contenido = json.dumps(embeddings, separators=(",", ":")).encode("utf-8")
    cifrado = fernet.encrypt(contenido)
    return cifrado.decode("utf-8")


# Recuperar las muestras con la misma clave usada al registrarlas.
def descifrar_embeddings(contenido_cifrado: str) -> list[list[float]]:
    fernet = obtener_fernet()
    try:
        contenido = fernet.decrypt(contenido_cifrado.encode("utf-8"))
    except InvalidToken as exc:
        raise RuntimeError("No se pudo descifrar la biometría") from exc
    return json.loads(contenido.decode("utf-8"))


# Fórmula de Human 3.3.6 / FaceRes. La puntuación NO es una probabilidad.
def calcular_similitud(a: list[float], b: list[float]) -> float:
    if len(a) != 1024 or len(b) != 1024:
        raise ValueError("Descriptor de dimensión inválida")
    if not all(math.isfinite(v) for v in a + b):
        raise ValueError("El descriptor contiene valores no finitos")
    suma = sum((x - y) ** 2 for x, y in zip(a, b))
    if not math.isfinite(suma):
        raise ValueError("Descriptor fuera de rango")
    distancia = math.floor(100 * 25 * suma + 0.5) / 100
    normalizado = (1 - math.sqrt(distancia) / 100 - 0.2) / 0.6
    return math.floor(100 * max(0.0, min(normalizado, 1.0)) + 0.5) / 100


def comparar_muestras(actual: list[float], muestras: list[list[float]], umbral: float):
    if len(muestras) != 5:
        raise ValueError("Registra nuevamente las cinco muestras")
    puntuaciones = [calcular_similitud(actual, muestra) for muestra in muestras]
    # Se exige mayoría (3 de 5), evitando depender de una sola muestra favorable.
    coincidencias = sum(valor >= umbral for valor in puntuaciones)
    return coincidencias >= 3, sorted(puntuaciones)[2], coincidencias
