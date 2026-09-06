from collections import Counter

from nltk import NaiveBayesClassifier
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize



# LIMPIEZA Y TOKENIZACIÓN


def limpiar_texto(texto: str) -> list[str]:
    texto = texto.lower()

    tokens = word_tokenize(
        texto,
        language="spanish"
    )

    palabras_ignoradas = set(
        stopwords.words("spanish")
    )

    palabras_limpias = [
        token
        for token in tokens
        if token.isalpha()
        and token not in palabras_ignoradas
    ]

    return palabras_limpias



# ANÁLISIS GENERAL


def analizar_texto(texto: str) -> dict:
    palabras_limpias = limpiar_texto(texto)

    contador = Counter(palabras_limpias)

    palabras_frecuentes = [
        {
            "palabra": palabra,
            "frecuencia": frecuencia
        }
        for palabra, frecuencia
        in contador.most_common(10)
    ]

    return {
        "cantidad_palabras": len(palabras_limpias),
        "tokens": palabras_limpias,
        "palabras_frecuentes": palabras_frecuentes
    }



# DATOS DE ENTRENAMIENTO (Conjunto de ejemplos para entrenar el clasificador de texto)


DATOS_ENTRENAMIENTO = [
    # VENTAS
    (
        "Quiero conocer el precio del producto",
        "VENTAS"
    ),
    (
        "Deseo comprar uno de sus servicios",
        "VENTAS"
    ),
    (
        "Necesito información sobre precios y promociones",
        "VENTAS"
    ),
    (
        "Quisiera contratar el servicio",
        "VENTAS"
    ),

    # SOPORTE
    (
        "Necesito ayuda con el servicio",
        "SOPORTE"
    ),
    (
        "Tengo un problema técnico",
        "SOPORTE"
    ),
    (
        "El sistema no funciona correctamente",
        "SOPORTE"
    ),
    (
        "Necesito soporte para solucionar un error",
        "SOPORTE"
    ),

    # RECLAMO
    (
        "La atención demoró demasiado",
        "RECLAMO"
    ),
    (
        "Estoy inconforme con el servicio",
        "RECLAMO"
    ),
    (
        "No solucionaron mi problema",
        "RECLAMO"
    ),
    (
        "El servicio fue muy malo",
        "RECLAMO"
    ),

    # CONSULTA
    (
        "Cuál es el horario de atención",
        "CONSULTA"
    ),
    (
        "Dónde se encuentra la empresa",
        "CONSULTA"
    ),
    (
        "Quisiera obtener más información",
        "CONSULTA"
    ),
    (
        "Tengo una consulta sobre sus servicios",
        "CONSULTA"
    ),

    # FELICITACION
    (
        "La atención fue excelente",
        "FELICITACION"
    ),
    (
        "El servicio fue muy rápido",
        "FELICITACION"
    ),
    (
        "Estoy muy satisfecho con la atención",
        "FELICITACION"
    ),
    (
        "Excelente trabajo del equipo",
        "FELICITACION"
    ),

    # OTROS
    (
        "Gracias por la información",
        "OTROS"
    ),
    (
        "Buen día",
        "OTROS"
    ),
    (
        "Saludos a todo el equipo",
        "OTROS"
    ),
    (
        "Mensaje general para la empresa",
        "OTROS"
    )
]



# CARACTERÍSTICAS PARA NLTK


def extraer_caracteristicas(
    palabras: list[str]
) -> dict:
    return {
        palabra: True
        for palabra in palabras
    }



# ENTRENAR CLASIFICADOR


def entrenar_clasificador():
    entrenamiento = []

    for texto, categoria in DATOS_ENTRENAMIENTO:
        palabras = limpiar_texto(texto)

        caracteristicas = extraer_caracteristicas(
            palabras
        )

        entrenamiento.append(
            (caracteristicas, categoria)
        )

    return NaiveBayesClassifier.train(
        entrenamiento
    )


CLASIFICADOR = entrenar_clasificador()



# CLASIFICAR TEXTO


def clasificar_texto(texto: str) -> dict:
    palabras = limpiar_texto(texto)

    caracteristicas = extraer_caracteristicas(
        palabras
    )

    distribucion = CLASIFICADOR.prob_classify(
        caracteristicas
    )

    categoria = distribucion.max()

    confianza = distribucion.prob(
        categoria
    )

    return {
        "categoria": categoria,
        "confianza": float(confianza)
    }