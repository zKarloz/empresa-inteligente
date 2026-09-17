"""Cálculos empresariales: validar antes de calcular y comprobar la solución."""
import numpy as np
from scipy import stats
from scipy.interpolate import interp1d
from scipy.optimize import minimize


def vector_finito(valores, nombre):
    datos = np.asarray(valores, dtype=float)
    if datos.ndim != 1 or not datos.size or not np.isfinite(datos).all():
        raise ValueError(f'{nombre} debe contener números finitos y no estar vacío')
    return datos


def calcular_estadisticas(valores: list[float]) -> dict:
    datos = vector_finito(valores, 'Los tiempos')
    if (datos < 0).any():
        raise ValueError('Los tiempos no pueden ser negativos')
    # Una observación no permite estimar la desviación estándar muestral.
    with np.errstate(over='ignore', invalid='ignore'):
        resultado = {
            'cantidad': len(datos),
            'media': float(np.mean(datos)),
            'mediana': float(np.median(datos)),
            'desviacion_estandar': float(stats.tstd(datos)) if len(datos) > 1 else None,
            'minimo': float(np.min(datos)),
            'maximo': float(np.max(datos)),
            'percentil_25': float(np.percentile(datos, 25)),
            'percentil_75': float(np.percentile(datos, 75)),
        }
    if any(v is not None and not np.isfinite(v) for v in resultado.values()):
        raise ValueError('Los valores son demasiado grandes para calcular estadísticas')
    return resultado


def interpolar_valores(x_conocidos, y_conocidos, x_estimar) -> list[dict]:
    x = vector_finito(x_conocidos, 'X conocidos')
    y = vector_finito(y_conocidos, 'Y conocidos')
    objetivos = vector_finito(x_estimar, 'X a estimar')
    if len(x) != len(y) or len(x) < 2:
        raise ValueError('X e Y deben tener igual longitud y al menos dos puntos')
    if max(len(x), len(objetivos)) > 1000:
        raise ValueError('Se permiten como máximo 1000 puntos por lista')
    if len(np.unique(x)) != len(x):
        raise ValueError('Los valores X conocidos no pueden repetirse')
    if len(np.unique(objetivos)) != len(objetivos):
        raise ValueError('Los valores X a estimar no pueden repetirse')
    if ((objetivos < x.min()) | (objetivos > x.max())).any():
        raise ValueError('Solo se puede interpolar dentro del intervalo conocido')
    # Ordenar X junto a Y evita cambiar la asociación entre los puntos.
    orden = np.argsort(x)
    funcion = interp1d(x[orden], y[orden], kind='linear', bounds_error=True)
    with np.errstate(over='ignore', invalid='ignore', divide='ignore'):
        estimados = funcion(objetivos)
    if not np.isfinite(estimados).all():
        raise ValueError('La escala de los datos impide una interpolación finita')
    return [{'x': float(a), 'valor_estimado': float(b)} for a, b in zip(objetivos, estimados)]


def optimizar_recursos(recurso_a_inicial, recurso_b_inicial, capacidad_minima) -> dict:
    vector_finito([recurso_a_inicial, recurso_b_inicial, capacidad_minima], 'Los parámetros')
    if not (0 <= recurso_a_inicial <= 10 and 0 <= recurso_b_inicial <= 10):
        raise ValueError('Cada recurso inicial debe estar entre 0 y 10')
    if not 0 < capacidad_minima <= 150:
        raise ValueError('La capacidad debe ser mayor que 0 y como máximo 150')

    def costo(x):
        a, b = x
        return 80*a + 50*b + 10*(a-3)**2

    inicial = [recurso_a_inicial, recurso_b_inicial]
    capacidad_inicial = 10*inicial[0] + 5*inicial[1]
    restriccion = {'type': 'ineq', 'fun': lambda x: 10*x[0] + 5*x[1] - capacidad_minima}
    resultado = minimize(costo, inicial, method='SLSQP', bounds=[(0, 10), (0, 10)],
                         constraints=[restriccion], options={'ftol': 1e-9, 'maxiter': 300})
    tolerancia = 1e-6
    if (not resultado.success or not np.isfinite(resultado.x).all()
            or not np.isfinite(resultado.fun)
            or (resultado.x < -tolerancia).any() or (resultado.x > 10+tolerancia).any()
            or restriccion['fun'](resultado.x) < -tolerancia):
        raise ValueError('No se obtuvo una solución válida para la capacidad solicitada')
    diferencia = float(costo(inicial) - resultado.fun)
    if abs(diferencia) < tolerancia:
        diferencia = 0.0
    return {
        'recurso_a': float(resultado.x[0]), 'recurso_b': float(resultado.x[1]),
        'costo_inicial': float(costo(inicial)), 'costo_optimizado': float(resultado.fun),
        # Se conserva la clave por compatibilidad: es una diferencia, no siempre un ahorro.
        'ahorro': diferencia,
        'capacidad_inicial': float(capacidad_inicial),
        'capacidad_optima': float(10*resultado.x[0] + 5*resultado.x[1]),
        'inicial_factible': bool(capacidad_inicial >= capacidad_minima),
    }
