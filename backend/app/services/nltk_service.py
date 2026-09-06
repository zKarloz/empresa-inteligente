from collections import Counter

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


def analizar_texto(texto: str) -> dict:
    # Convertir a minúsculas
    texto = texto.lower()

    # Tokenizar
    tokens = word_tokenize(
        texto,
        language="spanish"
    )

    # Stopwords del español
    palabras_ignoradas = set(
        stopwords.words("spanish")
    )

    # Solo palabras alfabéticas
    # y que no sean stopwords
    palabras_limpias = [
        token
        for token in tokens
        if token.isalpha()
        and token not in palabras_ignoradas
    ]

    # Contar palabras frecuentes
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