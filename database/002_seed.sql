-- DATOS DE PRUEBA

-- 1. CATEGORÍAS DE COMENTARIOS

INSERT INTO categorias (nombre, descripcion)
VALUES
('VENTAS', 'Consultas relacionadas con ventas y productos'),
('SOPORTE', 'Solicitudes de ayuda o soporte técnico'),
('RECLAMO', 'Quejas o inconvenientes reportados'),
('CONSULTA', 'Preguntas generales de los clientes'),
('FELICITACION', 'Comentarios positivos sobre el servicio'),
('OTROS', 'Comentarios que no pertenecen a otra categoría');

-- 2. CLIENTES

INSERT INTO clientes
(nombre, email, telefono, empresa)
VALUES
('María López', 'maria@ejemplo.com', '999111222', 'Empresa Andina'),
('Carlos Pérez', 'carlos@ejemplo.com', '999333444', 'Grupo Central'),
('Ana Torres', 'ana@ejemplo.com', '999555666', 'Servicios Norte'),
('Luis Ramírez', 'luis@ejemplo.com', '999777888', 'Comercial Lima'),
('Daniela Flores', 'daniela@ejemplo.com', '999999000', 'Soluciones Perú');

-- 3. COMENTARIOS DE CLIENTES

INSERT INTO comentarios
(cliente_id, contenido, canal, estado, categoria)
VALUES
(
    1,
    'El servicio fue rápido y la atención excelente',
    'web',
    'pendiente',
    'FELICITACION'
),
(
    2,
    'Necesito ayuda porque tengo un problema con el servicio',
    'web',
    'pendiente',
    'SOPORTE'
),
(
    3,
    'Quisiera conocer los precios de sus productos',
    'web',
    'pendiente',
    'VENTAS'
),
(
    4,
    'La atención demoró demasiado y no resolvieron mi problema',
    'web',
    'pendiente',
    'RECLAMO'
),
(
    5,
    '¿En qué horarios atiende la empresa?',
    'web',
    'pendiente',
    'CONSULTA'
),
(
    1,
    'El equipo de soporte respondió muy rápido',
    'web',
    'pendiente',
    'SOPORTE'
);

-- 4. TIEMPOS DE ATENCIÓN

INSERT INTO tiempos_atencion
(cliente_id, tiempo_minutos, operador)
VALUES
(1, 12, 'Operador 01'),
(2, 15, 'Operador 02'),
(3, 18, 'Operador 01'),
(4, 20, 'Operador 03'),
(5, 11, 'Operador 02'),
(1, 25, 'Operador 01'),
(2, 19, 'Operador 03'),
(3, 17, 'Operador 02'),
(4, 14, 'Operador 01'),
(5, 21, 'Operador 03');