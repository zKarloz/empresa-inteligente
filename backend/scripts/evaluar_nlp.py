"""Ejecutar desde backend: python scripts/evaluar_nlp.py. No usa Supabase."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.nltk_service import clasificar_texto, extraer_caracteristicas, tokenizar
from app.services.datos_nlp import DATOS_ENTRENAMIENTO, DATOS_SENTIMIENTO

# Evaluación didáctica independiente del entrenamiento, pequeña y escrita a mano.
# No añadir estos casos al entrenamiento para mejorar artificialmente el resultado.
CASOS = [
    ('Deseo comprar diez productos para mi negocio', 'VENTAS', 'NEUTRAL'),
    ('Pueden enviarme una cotización del plan anual', 'VENTAS', 'NEUTRAL'),
    ('Necesito contratar un servicio para mi oficina', 'VENTAS', 'NEUTRAL'),
    ('La aplicación falla y necesito soporte técnico', 'SOPORTE', 'NEGATIVO'),
    ('Necesito ayuda para recuperar mi contraseña', 'SOPORTE', 'NEUTRAL'),
    ('No puedo acceder al sistema desde ayer', 'SOPORTE', 'NEGATIVO'),
    ('La atención es horrible y estoy molesto', 'RECLAMO', 'NEGATIVO'),
    ('Mi producto llegó roto. Solicito un reembolso porque nadie responde.', 'RECLAMO', 'NEGATIVO'),
    ('Estoy inconforme porque la entrega demoró demasiado', 'RECLAMO', 'NEGATIVO'),
    ('Cuál es el horario de la oficina los sábados', 'CONSULTA', 'NEUTRAL'),
    ('En qué dirección se encuentra la empresa', 'CONSULTA', 'NEUTRAL'),
    ('Qué documentos necesito para registrarme', 'CONSULTA', 'NEUTRAL'),
    ('Felicitaciones por la atención excelente y rápida', 'FELICITACION', 'POSITIVO'),
    ('Estoy contento, su equipo hizo un trabajo excelente', 'FELICITACION', 'POSITIVO'),
    ('Resolvieron todas mis dudas. La atención fue buena y recomiendo su servicio.', 'FELICITACION', 'POSITIVO'),
    ('Hola a todos', 'OTROS', 'NEUTRAL'),
    ('Adjunto los datos solicitados', 'OTROS', 'NEUTRAL'),
    ('Les envío este mensaje de prueba', 'OTROS', 'NEUTRAL'),
]

def main():
    entrenados = {t.lower() for t, _ in DATOS_ENTRENAMIENTO + DATOS_SENTIMIENTO}
    assert all(t.lower() not in entrenados for t, _, _ in CASOS)
    assert extraer_caracteristicas(tokenizar('Estoy satisfecho')) != extraer_caracteristicas(tokenizar('No estoy satisfecho'))
    assert clasificar_texto('')['confianza'] == 0
    assert clasificar_texto('xyzabc')['confianza'] == 0
    assert clasificar_texto('el servicio fue malo')['sentimiento'] == 'NEGATIVO'
    aciertos = {'categoria': 0, 'sentimiento': 0}
    for texto, categoria, sentimiento in CASOS:
        resultado = clasificar_texto(texto)
        for campo, esperado in [('categoria', categoria), ('sentimiento', sentimiento)]:
            aciertos[campo] += resultado[campo] == esperado
            if resultado[campo] != esperado:
                print(f'ERROR {campo}: {texto!r}: {resultado[campo]} (esperado {esperado})')
    for campo, n in aciertos.items():
        print(f'{campo}: {n}/{len(CASOS)} ({n / len(CASOS):.1%})')
    print('Regresiones básicas: OK. Esta muestra no mide precisión en producción.')
    for texto in ['el servicio fue malo', 'Estoy satisfecho', 'No estoy satisfecho', 'El servicio no fue malo']:
        print(texto, '=>', clasificar_texto(texto))

if __name__ == '__main__':
    main()
