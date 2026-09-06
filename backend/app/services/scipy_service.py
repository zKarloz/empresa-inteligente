import numpy as np
from scipy import stats


def calcular_estadisticas(valores: list[float]) -> dict:
    if not valores:
        raise ValueError("No existen valores para calcular estadísticas")

    datos = np.array(valores, dtype=float)

    media = np.mean(datos)
    mediana = np.median(datos)

    if len(datos) > 1:
        desviacion = stats.tstd(datos)
    else:
        desviacion = 0.0

    minimo = np.min(datos)
    maximo = np.max(datos)

    percentil_25 = np.percentile(datos, 25)
    percentil_75 = np.percentile(datos, 75)

    return {
        "cantidad": len(datos),
        "media": float(media),
        "mediana": float(mediana),
        "desviacion_estandar": float(desviacion),
        "minimo": float(minimo),
        "maximo": float(maximo),
        "percentil_25": float(percentil_25),
        "percentil_75": float(percentil_75),
    }