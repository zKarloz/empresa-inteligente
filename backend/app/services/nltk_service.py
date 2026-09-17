"""Clasificación supervisada básica. Mantiene el contrato del dashboard."""
import re
import unicodedata
from collections import Counter
from functools import lru_cache

from nltk import NaiveBayesClassifier

from .datos_nlp import DATOS_ENTRENAMIENTO, DATOS_SENTIMIENTO

# Lista pequeña y explícita: no elimina negaciones. No requiere descargar corpus.
IGNORADAS = set('el la los las un una unos unas de del al a en por para con y o que '
                'es son fue fueron ser estoy esta este mi mis su sus se me lo muy '
                'he ha han haber'.split())
NEGACIONES = {'no', 'nunca', 'jamás', 'sin'}
CORTES = {'.', ',', ';', ':', '!', '?', 'pero', 'aunque', 'sino'}


def tokenizar(texto: str) -> list[str]:
    return re.findall(r'[^\W\d_]+|[.,;:!?]', unicodedata.normalize('NFC', texto.lower()))


def limpiar_texto(texto: str) -> list[str]:
    """Palabras para estadísticas; conserva su escritura y las negaciones."""
    return [p for p in tokenizar(texto) if p.isalpha() and p not in IGNORADAS]


def analizar_texto(texto: str) -> dict:
    palabras = limpiar_texto(texto)
    return {
        'cantidad_palabras': len(palabras),
        'tokens': palabras,
        'palabras_frecuentes': [
            {'palabra': p, 'frecuencia': n} for p, n in Counter(palabras).most_common(10)
        ],
    }


def extraer_caracteristicas(palabras: list[str]) -> dict:
    # Aproximación de negación: afecta a las próximas 3 palabras útiles.
    # La puntuación y conectores cortan su alcance; no resuelve toda la gramática.
    rasgos = {}
    restantes = 0
    anterior = None
    for palabra in palabras:
        if palabra in CORTES:
            restantes, anterior = 0, None
            continue
        if palabra in NEGACIONES:
            restantes, anterior = 3, None
            continue
        if palabra in IGNORADAS:
            continue
        actual = f'NEG_{palabra}' if restantes else palabra
        rasgos[f'palabra:{actual}'] = True
        if anterior:
            rasgos[f'par:{anterior}|{actual}'] = True
        anterior = actual
        restantes = max(0, restantes - 1)
    return rasgos


def entrenar_clasificador(datos=DATOS_ENTRENAMIENTO):
    ejemplos = [(extraer_caracteristicas(tokenizar(texto)), etiqueta)
                for texto, etiqueta in datos]
    vocabulario = {rasgo for rasgos, _ in ejemplos for rasgo in rasgos}
    return NaiveBayesClassifier.train(ejemplos), vocabulario


def entrenar_clasificador_sentimiento():
    return entrenar_clasificador(DATOS_SENTIMIENTO)


@lru_cache(maxsize=1)
def obtener_modelos():
    # Se entrenan una vez por proceso, al primer análisis, con las listas locales.
    return entrenar_clasificador(), entrenar_clasificador_sentimiento()


def predecir(modelo, caracteristicas, alternativa):
    # NLTK ignora rasgos desconocidos. Evitamos decidir solo por probabilidades previas.
    clasificador, vocabulario = modelo
    conocidos = {k: v for k, v in caracteristicas.items() if k in vocabulario}
    if not conocidos:
        return alternativa, 0.0
    distribucion = clasificador.prob_classify(conocidos)
    etiqueta = distribucion.max()
    return etiqueta, float(distribucion.prob(etiqueta))


def clasificar_sentimiento(texto: str) -> str:
    _, modelo = obtener_modelos()
    return predecir(modelo, extraer_caracteristicas(tokenizar(texto)), 'NEUTRAL')[0]


def determinar_prioridad(texto: str, categoria: str) -> str:
    # Reglas de negocio conservadas: prioridad no es otro modelo entrenado.
    texto = texto.lower()
    altas = ('urgente', 'inmediatamente', 'no funciona', 'no puedo acceder', 'caído',
             'caida', 'caída', 'pésimo', 'pesimo', 'fraude', 'reembolso', 'cancelar',
             'demoró demasiado')
    medias = ('problema', 'error', 'ayuda', 'soporte', 'demora', 'cotización',
              'cotizacion', 'contratar', 'precio')
    if categoria == 'RECLAMO' or any(p in texto for p in altas):
        return 'ALTA'
    if categoria in {'SOPORTE', 'VENTAS', 'CONSULTA'} or any(p in texto for p in medias):
        return 'MEDIA'
    return 'BAJA'


def clasificar_texto(texto: str) -> dict:
    modelo, sentimiento_modelo = obtener_modelos()
    rasgos = extraer_caracteristicas(tokenizar(texto))
    categoria, confianza = predecir(modelo, rasgos, 'OTROS')
    sentimiento, _ = predecir(sentimiento_modelo, rasgos, 'NEUTRAL')
    return {
        'categoria': categoria,
        'confianza': confianza,  # Probabilidad de categoría, no precisión medida.
        'sentimiento': sentimiento,
        'prioridad': determinar_prioridad(texto, categoria),
    }
