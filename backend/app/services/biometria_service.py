import json
import os
import math

from cryptography.fernet import Fernet, InvalidToken


def obtener_fernet() -> Fernet:

    clave = os.getenv("BIOMETRIC_KEY")

    if not clave:
        raise RuntimeError(
            "BIOMETRIC_KEY no está configurada"
        )

    return Fernet(
        clave.encode("utf-8")
    )


def cifrar_embeddings(
    embeddings: list[list[float]]
) -> str:

    fernet = obtener_fernet()

    contenido = json.dumps(
        embeddings,
        separators=(",", ":")
    ).encode("utf-8")

    cifrado = fernet.encrypt(
        contenido
    )

    return cifrado.decode("utf-8")


def descifrar_embeddings(
    contenido_cifrado: str
) -> list[list[float]]:

    fernet = obtener_fernet()

    try:

        contenido = fernet.decrypt(
            contenido_cifrado.encode("utf-8")
        )

    except InvalidToken as exc:

        raise RuntimeError(
            "No se pudo descifrar la biometría"
        ) from exc

    return json.loads(
        contenido.decode("utf-8")
    )

# =========================================================
# SIMILITUD COMPATIBLE CON HUMAN / FACERES
# =========================================================

def calcular_similitud(
    embedding_1: list[float],
    embedding_2: list[float],
) -> float:

    if len(embedding_1) != len(embedding_2):
        return 0.0


    # Human FaceRes:
    # order = 2
    # multiplier = 25
    # min = 0.2
    # max = 0.8

    suma = 0.0

    for valor_1, valor_2 in zip(
        embedding_1,
        embedding_2,
    ):
        diferencia = valor_1 - valor_2

        suma += diferencia * diferencia


    distancia = round(
        100 * 25 * suma
    ) / 100


    raiz = math.sqrt(
        distancia
    )


    normalizado = (
        1 - (raiz / 100) - 0.2
    ) / (
        0.8 - 0.2
    )


    similitud = max(
        0.0,
        min(
            normalizado,
            1.0,
        ),
    )


    return round(
        similitud,
        2,
    )


def buscar_mejor_coincidencia(
    embedding_actual: list[float],
    muestras_guardadas: list[list[float]],
) -> tuple[int | None, float]:

    mejor_indice = None
    mejor_similitud = 0.0


    for indice, muestra in enumerate(
        muestras_guardadas
    ):

        similitud = calcular_similitud(
            embedding_actual,
            muestra,
        )


        if similitud > mejor_similitud:

            mejor_similitud = similitud
            mejor_indice = indice


    return (
        mejor_indice,
        mejor_similitud,
    )