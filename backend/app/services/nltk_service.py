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

DATOS_SENTIMIENTO = [
    # POSITIVO
    ("La atención fue excelente", "POSITIVO"),
    ("Estoy muy satisfecho con el servicio", "POSITIVO"),
    ("Muchas gracias por la ayuda", "POSITIVO"),
    ("El equipo hizo un buen trabajo", "POSITIVO"),
    ("El servicio fue rápido y eficiente", "POSITIVO"),
    ("Me atendieron muy bien", "POSITIVO"),

    # NEGATIVO
    ("La atención fue pésima", "NEGATIVO"),
    ("Estoy molesto con el servicio", "NEGATIVO"),
    ("No solucionaron mi problema", "NEGATIVO"),
    ("El sistema funciona muy mal", "NEGATIVO"),
    ("Demoraron demasiado en atenderme", "NEGATIVO"),
    ("Estoy inconforme con la atención", "NEGATIVO"),

    # NEUTRAL
    ("Quiero conocer el horario de atención", "NEUTRAL"),
    ("Necesito información sobre sus servicios", "NEUTRAL"),
    ("Cuál es el precio del producto", "NEUTRAL"),
    ("Deseo comunicarme con la empresa", "NEUTRAL"),
    ("Quisiera realizar una consulta", "NEUTRAL"),
    ("Dónde se encuentra su oficina", "NEUTRAL"),
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

def entrenar_clasificador_sentimiento():
    entrenamiento = []

    for texto, sentimiento in DATOS_SENTIMIENTO:
        palabras = limpiar_texto(texto)

        caracteristicas = extraer_caracteristicas(
            palabras
        )

        entrenamiento.append(
            (caracteristicas, sentimiento)
        )

    return NaiveBayesClassifier.train(
        entrenamiento
    )


CLASIFICADOR_SENTIMIENTO = (
    entrenar_clasificador_sentimiento()
)


def clasificar_sentimiento(texto: str) -> str:
    palabras = limpiar_texto(texto)

    caracteristicas = extraer_caracteristicas(
        palabras
    )

    return CLASIFICADOR_SENTIMIENTO.classify(
        caracteristicas
    )


def determinar_prioridad(
    texto: str,
    categoria: str
) -> str:
    texto_normalizado = texto.lower()

    indicadores_alta = [
        "urgente",
        "inmediatamente",
        "no funciona",
        "no puedo acceder",
        "caído",
        "caida",
        "caída",
        "pésimo",
        "pesimo",
        "fraude",
        "reembolso",
        "cancelar",
        "demoró demasiado",
    ]

    indicadores_media = [
        "problema",
        "error",
        "ayuda",
        "soporte",
        "demora",
        "cotización",
        "cotizacion",
        "contratar",
        "precio",
    ]

    if (
        categoria == "RECLAMO"
        or any(
            indicador in texto_normalizado
            for indicador in indicadores_alta
        )
    ):
        return "ALTA"

    if (
        categoria in {
            "SOPORTE",
            "VENTAS",
            "CONSULTA",
        }
        or any(
            indicador in texto_normalizado
            for indicador in indicadores_media
        )
    ):
        return "MEDIA"

    return "BAJA"

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

    sentimiento = clasificar_sentimiento(
        texto
    )

    prioridad = determinar_prioridad(
        texto,
        categoria
    )

    return {
        "categoria": categoria,
        "confianza": float(confianza),
        "sentimiento": sentimiento,
        "prioridad": prioridad,
    }