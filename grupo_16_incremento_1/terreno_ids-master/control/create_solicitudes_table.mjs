import pool from './db.js';

await pool.query(`
  CREATE TABLE IF NOT EXISTS inventario.solicitud_permiso (
    id_solicitud BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_usuario_solicitante BIGINT NOT NULL,
    accion TEXT NOT NULL,
    datos JSONB,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    id_usuario_revisor BIGINT,
    motivo_rechazo TEXT,
    CONSTRAINT pk_solicitud_permiso PRIMARY KEY (id_solicitud)
  )
`);
console.log('Tabla solicitud_permiso creada');
pool.end();
