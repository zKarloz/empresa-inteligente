"""Desde backend: python scripts/evaluar_metricas.py. No utiliza la base de datos."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.schemas.metrica import InterpolacionRequest, OptimizacionRequest, EstadisticasResponse
from app.services.scipy_service import calcular_estadisticas, interpolar_valores, optimizar_recursos
from pydantic import ValidationError
from math import isclose


def rechaza(funcion):
    try:
        funcion()
    except (ValueError, ValidationError):
        return
    raise AssertionError('Se aceptó una entrada inválida')


def main():
    r = calcular_estadisticas([10,20,30])
    assert r['media'] == r['mediana'] == 20
    assert isclose(r['desviacion_estandar'], 10)
    assert r['percentil_25'] == 15 and r['percentil_75'] == 25
    assert calcular_estadisticas([10])['desviacion_estandar'] is None
    EstadisticasResponse(**calcular_estadisticas([10]))
    for v in [[], [-1], [float('nan')], [float('inf')]]:
        rechaza(lambda: calcular_estadisticas(v))
    for v in [[], [1], [float('nan'),2], [float('inf'),2]]:
        rechaza(lambda: InterpolacionRequest(x_conocidos=v,y_conocidos=[1,2],x_estimar=[1]))
    for x,y,z in [([1,1],[2,3],[1]),([1,2],[3],[1]),([1,2],[3,4],[3]),([1,2],[3,4],[]),([1,2],[3,4],[1,1])]:
        rechaza(lambda: InterpolacionRequest(x_conocidos=x,y_conocidos=y,x_estimar=z))
        rechaza(lambda: interpolar_valores(x,y,z))
    r = interpolar_valores([6,1,3,4],[18000,12000,14500,15000],[2,5])
    assert r[0]['valor_estimado'] == 13250 and r[1]['valor_estimado'] == 16500
    for kwargs in [{'recurso_a_inicial':-1},{'recurso_b_inicial':11},{'capacidad_minima':151},{'capacidad_minima':0},{'capacidad_minima':float('inf')},{'nombre':'   '}]:
        rechaza(lambda: OptimizacionRequest(**kwargs))
    for a,b,c in [(2,4,40),(0,0,40),(10,10,150),(0,0,150),(1,1,0.01)]:
        r=optimizar_recursos(a,b,c)
        assert r['capacidad_optima'] >= c-1e-6
        assert 0-1e-6 <= r['recurso_a'] <= 10+1e-6
        assert 0-1e-6 <= r['recurso_b'] <= 10+1e-6
        assert r['inicial_factible'] == (10*a+5*b >= c)
        if r['inicial_factible']: assert r['costo_optimizado'] <= r['costo_inicial']+1e-6
    print('OK: estadísticas, muestra única, listas inválidas, interpolación desordenada, límites y factibilidad de optimización.')

if __name__ == '__main__': main()
