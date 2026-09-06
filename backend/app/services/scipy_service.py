import numpy as np

from scipy import stats
from scipy.interpolate import interp1d
from scipy.optimize import minimize


# ============================================
# ESTADÍSTICAS
# ============================================

def calcular_estadisticas(valores: list[float]) -> dict:
    if not valores:
        raise ValueError(
            "No existen valores para calcular estadísticas"
        )

    datos = np.array(
        valores,
        dtype=float
    )

    media = np.mean(datos)
    mediana = np.median(datos)

    if len(datos) > 1:
        desviacion = stats.tstd(datos)
    else:
        desviacion = 0.0

    minimo = np.min(datos)
    maximo = np.max(datos)

    percentil_25 = np.percentile(
        datos,
        25
    )

    percentil_75 = np.percentile(
        datos,
        75
    )

    return {
        "cantidad": len(datos),
        "media": float(media),
        "mediana": float(mediana),
        "desviacion_estandar": float(desviacion),
        "minimo": float(minimo),
        "maximo": float(maximo),
        "percentil_25": float(percentil_25),
        "percentil_75": float(percentil_75)
    }


# ============================================
# INTERPOLACIÓN
# ============================================

def interpolar_valores(
    x_conocidos: list[float],
    y_conocidos: list[float],
    x_estimar: list[float]
) -> list[dict]:

    if len(x_conocidos) != len(y_conocidos):
        raise ValueError(
            "Los valores X e Y deben tener la misma cantidad de elementos"
        )

    if len(x_conocidos) < 2:
        raise ValueError(
            "Se necesitan al menos dos puntos conocidos"
        )

    x = np.array(
        x_conocidos,
        dtype=float
    )

    y = np.array(
        y_conocidos,
        dtype=float
    )

    if len(set(x)) != len(x):
        raise ValueError(
            "Los valores X conocidos no pueden repetirse"
        )

    funcion = interp1d(
        x,
        y,
        kind="linear"
    )

    minimo_x = np.min(x)
    maximo_x = np.max(x)

    resultados = []

    for valor_x in x_estimar:

        if valor_x < minimo_x or valor_x > maximo_x:
            raise ValueError(
                f"El valor {valor_x} está fuera del rango de interpolación"
            )

        valor_estimado = float(
            funcion(valor_x)
        )

        resultados.append({
            "x": float(valor_x),
            "valor_estimado": valor_estimado
        })

    return resultados


# ============================================
# OPTIMIZACIÓN
# ============================================

def optimizar_recursos(
    recurso_a_inicial: float,
    recurso_b_inicial: float,
    capacidad_minima: float
) -> dict:

    def costo(x):
        recurso_a, recurso_b = x

        return (
            80 * recurso_a
            + 50 * recurso_b
            + 10 * (recurso_a - 3) ** 2
        )

    restriccion = {
        "type": "ineq",
        "fun": lambda x:
            10 * x[0]
            + 5 * x[1]
            - capacidad_minima
    }

    punto_inicial = [
        recurso_a_inicial,
        recurso_b_inicial
    ]

    costo_inicial = float(
        costo(punto_inicial)
    )

    resultado = minimize(
        costo,
        x0=punto_inicial,
        bounds=[
            (0, 10),
            (0, 10)
        ],
        constraints=[
            restriccion
        ]
    )

    if not resultado.success:
        raise ValueError(
            f"No se pudo encontrar una solución: {resultado.message}"
        )

    recurso_a = float(
        resultado.x[0]
    )

    recurso_b = float(
        resultado.x[1]
    )

    costo_optimizado = float(
        resultado.fun
    )

    return {
        "recurso_a": recurso_a,
        "recurso_b": recurso_b,
        "costo_inicial": costo_inicial,
        "costo_optimizado": costo_optimizado,
        "ahorro": costo_inicial - costo_optimizado
    }