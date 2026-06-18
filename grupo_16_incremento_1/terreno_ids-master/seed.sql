-- Seed data for Sistema Puertas Blindadas
-- Runs after init.sql in docker-entrypoint-initdb.d

-- ============================================================
-- INVENTARIO - Perfiles y permisos básicos
-- ============================================================
INSERT INTO inventario.perfil (perfil_nombre_perfil, perfil_descripcion) VALUES
  ('Administrador', 'Acceso total al sistema'),
  ('Técnico', 'Acceso a tareas y servicios de terreno'),
  ('Secretaria', 'Gestión administrativa y clientes'),
  ('Gerencia', 'Visión financiera y reportes'),
  ('JOP', 'Jefe de obra - planificación y control')
ON CONFLICT (perfil_nombre_perfil) DO NOTHING;

-- ============================================================
-- INVENTARIO - Área de trabajo
-- ============================================================
INSERT INTO inventario.area_trabajo (area_trabajo_nombre_area, area_trabajo_clasificacion, area_trabajo_activo) VALUES
  ('Principal', 'Producción', TRUE),
  ('Bodega Central', 'Almacenamiento', TRUE),
  ('Instalación', 'Terreno', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INVENTARIO - Usuarios
-- ============================================================
INSERT INTO inventario.usuario (usuario_username, usuario_rut_usuario, usuario_correo, usuario_estado_cuenta, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, perfil_id_perfil, usuario_es_administrador, usuario_es_tecnico, usuario_es_gerencia, usuario_es_jop, usuario_es_secretaria) VALUES
  ('admi', '12345123-4', 'admi@puertas.cl', 'activa', 'Admin', 'Principal', 1, TRUE, FALSE, FALSE, FALSE, FALSE),
  ('felipe', '12123123-4', 'felipe@puertas.cl', 'activa', 'Felipe', 'Técnico', 2, FALSE, TRUE, FALSE, FALSE, FALSE),
  ('karmen', '14145145-6', 'karmen@puertas.cl', 'activa', 'Karmen', 'Secretaria', 3, FALSE, FALSE, FALSE, FALSE, TRUE)
ON CONFLICT (usuario_username) DO NOTHING;

-- Contraseñas en texto plano (todas: 123456)
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena)
SELECT usuario_id_usuario, '123456' FROM inventario.usuario
ON CONFLICT (usuario_id_usuario) DO NOTHING;

-- ============================================================
-- TERRENO - Cliente de ejemplo
-- ============================================================
INSERT INTO terreno.cliente (rut_cliente, razon_social, contacto_principal, correo, telefono, es_cliente_b2c, es_cliente_b2b) VALUES
  ('11111111-1', 'Cliente Ejemplo B2C', 'Juan Pérez', 'juan@email.com', '912345678', TRUE, FALSE)
ON CONFLICT (rut_cliente) DO NOTHING;

-- ============================================================
-- TERRENO - Especificación puerta de ejemplo
-- ============================================================
INSERT INTO terreno.medidas_puerta (
  medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor,
  medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor,
  medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor,
  medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor,
  medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor,
  alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor
) VALUES (
  900, 2100, 120,
  800, 2000, 100,
  850, 2050, 110,
  100, 200, 50,
  100, 200, 50,
  200, 950, 2120, 130
);

INSERT INTO terreno.especificacion_puerta (
  modelo_puerta, zona, sentido_apertura, materialidad_vano, materialidad_marco_actual,
  solucion_marco, hoja_pasiva, hoja_activa, diseno_puerta, observaciones_de_diseno,
  cubrejuntas, bisagras, observaciones, id_medidas
) VALUES (
  'Puerta Blindada Estándar', 'Principal', 'Derecha', 'Hormigón', 'Metal',
  'Marco reforzado', 'Fija', 'Activa', 'Clásico', 'Sin observaciones',
  TRUE, '3 bisagras reforzadas', 'Puerta de ejemplo', 1
);

-- ============================================================
-- TERRENO - Obra de ejemplo
-- ============================================================
INSERT INTO terreno.obra (
  nombre_obra, direccion_obra, comuna, region, tipo_obra,
  fecha_de_creacion, fecha_de_ultima_edicion, estado,
  cantidad_puerta, referencia, observaciones,
  rut_cliente, id_especificacion_puerta
) VALUES (
  'Obra Ejemplo', 'Av. Principal 123', 'Santiago', 'Metropolitana', 'Residencial',
  CURRENT_DATE, CURRENT_DATE, 'Pendiente',
  1, 'REF-001', 'Obra de demostración',
  '11111111-1', 1
);
