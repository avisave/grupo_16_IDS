-- ============================================================
-- Sistema Puertas Blindadas — Módulo Inventario
-- SQL CORREGIDO v2
-- Schema: inventario | Grupo 14
--
-- CAMBIOS v2 respecto al SQL regularizado anterior:
-- - ELIMINADAS: empleado, empleado_cargo, empleado_tipo_vinculo_laboral
--   → Estas tablas pasan al schema finanzas por decisión de arquitectura.
--   → Las referencias a empleado_rut_empleado en usuario se mantienen
--     como FK blanda (sin constraint) hacia finanzas.schema.
-- - MANTENIDAS: perfil, permiso, perfil_permiso, usuario
--   → Inventario es el dueño del módulo compartido/seguridad.
-- ============================================================

BEGIN;

DROP SCHEMA IF EXISTS inventario CASCADE;
CREATE SCHEMA inventario;
SET search_path TO inventario;

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 1 — CATÁLOGOS BASE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE material_categoria_general (
    material_categoria_general_id_categoria_general  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_categoria_general_nombre                VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mat_cat_gen PRIMARY KEY (material_categoria_general_id_categoria_general),
    CONSTRAINT uk_mat_cat_gen_nombre UNIQUE (material_categoria_general_nombre)
);

CREATE TABLE material_categoria_funcional (
    material_categoria_funcional_id_categoria_funcional  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_categoria_funcional_nombre                  VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mat_cat_func PRIMARY KEY (material_categoria_funcional_id_categoria_funcional),
    CONSTRAINT uk_mat_cat_func_nombre UNIQUE (material_categoria_funcional_nombre)
);

CREATE TABLE material_clasificacion_categoria (
    material_clasificacion_categoria_id               BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_clasificacion_categoria_nombre_categoria VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mat_clas_cat PRIMARY KEY (material_clasificacion_categoria_id)
);

CREATE TABLE material_clasificacion_subcategoria (
    material_clasificacion_subcategoria_id                   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_clasificacion_subcategoria_nombre_subcategoria  VARCHAR(150) NOT NULL,
    material_clasificacion_subcategoria_es_color_custom      BOOLEAN NOT NULL DEFAULT FALSE,
    material_clasificacion_categoria_id                      BIGINT NOT NULL,
    CONSTRAINT pk_mat_clas_sub PRIMARY KEY (material_clasificacion_subcategoria_id)
);

CREATE TABLE material_clasificacion_nivel_especifico (
    material_clasificacion_nivel_especifico_id               BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_clasificacion_nivel_especifico_nombre_nivel_especifico VARCHAR(150) NOT NULL,
    material_clasificacion_subcategoria_id                   BIGINT NOT NULL,
    CONSTRAINT pk_mat_clas_niv PRIMARY KEY (material_clasificacion_nivel_especifico_id)
);

CREATE TABLE material_unidad_medida (
    material_unidad_medida_id_unidad_medida  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    material_unidad_medida_nombre            VARCHAR(100) NOT NULL,
    CONSTRAINT pk_mat_unidad PRIMARY KEY (material_unidad_medida_id_unidad_medida),
    CONSTRAINT uk_mat_unidad_nombre UNIQUE (material_unidad_medida_nombre)
);

CREATE TABLE historial_alerta (
    historial_alerta_id_historial          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    historial_alerta_fecha_hora_resolucion TIMESTAMPTZ,
    CONSTRAINT pk_hist_alerta PRIMARY KEY (historial_alerta_id_historial)
);

CREATE TABLE alerta_inventario_nivel_prioridad (
    alerta_inventario_nivel_prioridad_id_nivel_prioridad  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    alerta_inventario_prioridad_nombre                    VARCHAR(100) NOT NULL,
    CONSTRAINT pk_alert_niv PRIMARY KEY (alerta_inventario_nivel_prioridad_id_nivel_prioridad)
);

CREATE TABLE alerta_inventario_tipo_alerta (
    alerta_inventario_tipo_alerta_id_tipo_alerta  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    alerta_inventario_tipo_alerta_nombre          VARCHAR(150) NOT NULL,
    alerta_inventario_nivel_prioridad_id          BIGINT NOT NULL,
    CONSTRAINT pk_alert_tipo PRIMARY KEY (alerta_inventario_tipo_alerta_id_tipo_alerta)
);

CREATE TABLE movimiento_inventario_tipo_movimiento (
    movimiento_inventario_tipo_movimiento_id_tipo_movimiento  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    movimiento_inventario_tipo_movimiento_nombre              VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mov_tipo PRIMARY KEY (movimiento_inventario_tipo_movimiento_id_tipo_movimiento),
    CONSTRAINT uk_mov_tipo_nombre UNIQUE (movimiento_inventario_tipo_movimiento_nombre)
);

CREATE TABLE movimiento_inventario_clasificacion_salida (
    movimiento_inventario_clasificacion_salida_id_clasificacion_salida  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    movimiento_inventario_clasificacion_salida_nombre                   VARCHAR(150) NOT NULL,
    CONSTRAINT pk_mov_clas PRIMARY KEY (movimiento_inventario_clasificacion_salida_id_clasificacion_salida),
    CONSTRAINT uk_mov_clas_nombre UNIQUE (movimiento_inventario_clasificacion_salida_nombre)
);

CREATE TABLE movimiento_inventario_motivo_movimiento (
    movimiento_inventario_motivo_movimiento_id_motivo_movimiento        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    movimiento_inventario_motivo_movimiento_nombre                      VARCHAR(150) NOT NULL,
    movimiento_inventario_clasificacion_salida_id_clasificacion_salida  BIGINT,
    CONSTRAINT pk_mov_motivo PRIMARY KEY (movimiento_inventario_motivo_movimiento_id_motivo_movimiento)
);

CREATE TABLE factura_compra_tipo_cambio (
    factura_compra_tipo_cambio_id_tipo_cambio  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    factura_compra_tipo_cambio_moneda          VARCHAR(10) NOT NULL,
    factura_compra_tipo_cambio_valor           NUMERIC(14,4) NOT NULL,
    CONSTRAINT pk_tipo_cambio PRIMARY KEY (factura_compra_tipo_cambio_id_tipo_cambio),
    CONSTRAINT ck_tipo_cambio_valor CHECK (factura_compra_tipo_cambio_valor > 0)
);

CREATE TABLE perfil (
    perfil_id_perfil     BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    perfil_nombre_perfil VARCHAR(150) NOT NULL,
    perfil_descripcion   TEXT,
    CONSTRAINT pk_perfil PRIMARY KEY (perfil_id_perfil),
    CONSTRAINT uk_perfil_nombre UNIQUE (perfil_nombre_perfil)
);

CREATE TABLE permiso (
    permiso_id_permiso         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    permiso_modulo             VARCHAR(150) NOT NULL,
    permiso_accion             VARCHAR(150) NOT NULL,
    permiso_descripcion        TEXT,
    permiso_nombre_del_permiso VARCHAR(150),
    CONSTRAINT pk_permiso PRIMARY KEY (permiso_id_permiso),
    CONSTRAINT uk_permiso_modulo_accion UNIQUE (permiso_modulo, permiso_accion)
);

CREATE TABLE area_trabajo (
    area_trabajo_id_area      BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    area_trabajo_clasificacion VARCHAR(150),
    area_trabajo_activo       BOOLEAN NOT NULL DEFAULT TRUE,
    area_trabajo_nombre_area  VARCHAR(150) NOT NULL,
    CONSTRAINT pk_area PRIMARY KEY (area_trabajo_id_area)
);

CREATE TABLE producto_terminado (
    producto_terminado_id_producto                   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    producto_terminado_tipo_producto                 VARCHAR(150),
    producto_terminado_nombre_producto               VARCHAR(200) NOT NULL,
    producto_terminado_codigo_producto               VARCHAR(80),
    producto_terminado_requerimientos_certificacion  TEXT,
    producto_terminado_requerimientos_medidas        TEXT,
    producto_terminado_requerimientos_produccion     TEXT,
    producto_terminado_requerimientos_instalacion    TEXT,
    producto_terminado_activo                        BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_prod_term PRIMARY KEY (producto_terminado_id_producto),
    CONSTRAINT uk_prod_term_codigo UNIQUE (producto_terminado_codigo_producto)
);

CREATE TABLE bodega (
    bodega_id_bodega     BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    bodega_nombre_bodega VARCHAR(150) NOT NULL,
    bodega_direccion     TEXT,
    bodega_estado        VARCHAR(50) NOT NULL,
    CONSTRAINT pk_bodega PRIMARY KEY (bodega_id_bodega)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 2 — ENTIDADES PRINCIPALES
-- ══════════════════════════════════════════════════════════════

CREATE TABLE material (
    material_sku                                          VARCHAR(16)  NOT NULL,
    material_nombre_material                              VARCHAR(200) NOT NULL,
    material_descripcion                                  TEXT,
    material_material_critico                             BOOLEAN NOT NULL DEFAULT FALSE,
    material_presentacion                                 VARCHAR(150),
    material_stock_critico                                NUMERIC(12,4),
    material_stock_maximo                                 NUMERIC(12,4),
    material_stock_minimo                                 NUMERIC(12,4),
    material_es_rotativo                                  BOOLEAN NOT NULL DEFAULT TRUE,
    material_estado                                       VARCHAR(50) NOT NULL,
    es_material_pintura_custom                            BOOLEAN,
    material_pintura_pintura_custom                       VARCHAR(100),
    es_material_pintura_no_custom                         BOOLEAN,
    material_pintura_no_custom                            VARCHAR(100),
    material_categoria_general_id_categoria_general       BIGINT,
    material_categoria_funcional_id_categoria_funcional   BIGINT,
    material_clasificacion_nivel_especifico_id            BIGINT,
    material_unidad_medida_id_unidad_medida               BIGINT NOT NULL,
    CONSTRAINT pk_material PRIMARY KEY (material_sku),
    CONSTRAINT ck_material_sku_len CHECK (length(material_sku) BETWEEN 4 AND 16),
    CONSTRAINT ck_mat_stock_min  CHECK (material_stock_minimo >= 0),
    CONSTRAINT ck_mat_stock_max  CHECK (material_stock_maximo >= 0),
    CONSTRAINT ck_mat_stock_crit CHECK (material_stock_critico >= 0)
);

CREATE TABLE material_codigo_barras (
    material_sku           VARCHAR(16)  NOT NULL,
    material_codigo_barras VARCHAR(100) NOT NULL,
    CONSTRAINT pk_mat_cod_bar PRIMARY KEY (material_sku, material_codigo_barras)
);

CREATE TABLE proveedor (
    proveedor_id_proveedor                              BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    proveedor_pais                                      VARCHAR(100),
    proveedor_tipo_proveedor                            VARCHAR(150),
    proveedor_rubro                                     TEXT,
    proveedor_razon_social                              VARCHAR(200) NOT NULL,
    proveedor_contacto_primer_nombre                    VARCHAR(100),
    proveedor_contacto_segundo_nombre                   VARCHAR(100),
    proveedor_contacto_primer_apellido                  VARCHAR(100),
    proveedor_contacto_segundo_apellido                 VARCHAR(100),
    proveedor_estado                                    VARCHAR(50) NOT NULL,
    proveedor_doc_identidad_tipo_identificador          VARCHAR(80),
    proveedor_doc_identidad_rut_proveedor_opcional      VARCHAR(20),
    proveedor_doc_identidad_pais_emision_identificador  VARCHAR(100),
    proveedor_doc_identidad_numero_identificador        VARCHAR(80),
    CONSTRAINT pk_proveedor PRIMARY KEY (proveedor_id_proveedor)
);

CREATE TABLE proveedor_contacto_telefono (
    proveedor_id_proveedor       BIGINT      NOT NULL,
    proveedor_contacto_telefono  VARCHAR(30) NOT NULL,
    CONSTRAINT pk_prov_tel PRIMARY KEY (proveedor_id_proveedor, proveedor_contacto_telefono)
);

CREATE TABLE proveedor_contacto_correo (
    proveedor_id_proveedor    BIGINT       NOT NULL,
    proveedor_contacto_correo VARCHAR(254) NOT NULL,
    CONSTRAINT pk_prov_correo PRIMARY KEY (proveedor_id_proveedor, proveedor_contacto_correo)
);

CREATE TABLE material_proveedor (
    material_sku                           VARCHAR(16)   NOT NULL,
    proveedor_id_proveedor                 BIGINT        NOT NULL,
    material_proveedor_tiempo_reposicion   INTEGER,
    material_proveedor_precio_referencial  NUMERIC(14,2),
    material_proveedor_proveedor_principal BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_mat_prov PRIMARY KEY (material_sku, proveedor_id_proveedor),
    CONSTRAINT ck_mat_prov_precio CHECK (material_proveedor_precio_referencial >= 0),
    CONSTRAINT ck_mat_prov_tiempo CHECK (material_proveedor_tiempo_reposicion >= 0)
);

CREATE TABLE material_producto_terminado (
    material_sku                                   VARCHAR(16)   NOT NULL,
    producto_terminado_id_producto                 BIGINT        NOT NULL,
    material_producto_terminado_cantidad_estimada  NUMERIC(12,4),
    material_producto_terminado_merma_estimada     NUMERIC(12,4),
    CONSTRAINT pk_mat_prod PRIMARY KEY (material_sku, producto_terminado_id_producto),
    CONSTRAINT ck_mat_prod_cant  CHECK (material_producto_terminado_cantidad_estimada >= 0),
    CONSTRAINT ck_mat_prod_merma CHECK (material_producto_terminado_merma_estimada >= 0)
);

CREATE TABLE anaquel (
    anaquel_id_anaquel  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    anaquel_descripcion TEXT,
    bodega_id_bodega    BIGINT NOT NULL,
    CONSTRAINT pk_anaquel PRIMARY KEY (anaquel_id_anaquel)
);

CREATE TABLE factura_compra (
    factura_compra_id_factura                 BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    factura_compra_numero_factura             VARCHAR(80)   NOT NULL,
    factura_compra_monto_neto                 NUMERIC(14,2),
    factura_compra_tipo_compra                VARCHAR(100),
    factura_compra_fecha_emision              DATE          NOT NULL,
    proveedor_id_proveedor                    BIGINT        NOT NULL,
    factura_compra_tipo_cambio_id_tipo_cambio BIGINT,
    CONSTRAINT pk_factura PRIMARY KEY (factura_compra_id_factura),
    CONSTRAINT uk_factura_numero UNIQUE (factura_compra_numero_factura),
    CONSTRAINT ck_factura_monto CHECK (factura_compra_monto_neto >= 0)
);

CREATE TABLE lote (
    lote_id_lote              BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    lote_numero_lote          VARCHAR(80),
    lote_fecha_ingreso        DATE,
    lote_fecha_vencimiento    DATE,
    lote_fecha_recepcion      DATE,
    lote_estado               VARCHAR(50) NOT NULL,
    proveedor_id_proveedor    BIGINT,
    factura_compra_id_factura BIGINT,
    -- FK blanda hacia terreno/produccion
    proyecto_id_proyecto      BIGINT,
    CONSTRAINT pk_lote PRIMARY KEY (lote_id_lote)
);

CREATE TABLE lote_fecha_pedido (
    lote_fecha_pedido_id              BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    lote_fecha_pedido_fecha_pedido    DATE          NOT NULL,
    lote_fecha_pedido_precio_unitario NUMERIC(14,2) NOT NULL,
    lote_id_lote                      BIGINT        NOT NULL,
    CONSTRAINT pk_lote_fecha_ped PRIMARY KEY (lote_fecha_pedido_id),
    CONSTRAINT ck_lote_fp_precio CHECK (lote_fecha_pedido_precio_unitario >= 0)
);

CREATE TABLE inventario_bodega (
    material_sku                         VARCHAR(16)   NOT NULL,
    lote_id_lote                         BIGINT        NOT NULL,
    bodega_id_bodega                     BIGINT        NOT NULL,
    inventario_bodega_cantidad_fisica    NUMERIC(12,4) NOT NULL DEFAULT 0,
    inventario_bodega_cantidad_reservada NUMERIC(12,4) NOT NULL DEFAULT 0,
    CONSTRAINT pk_inv_bodega PRIMARY KEY (material_sku, lote_id_lote, bodega_id_bodega),
    CONSTRAINT ck_inv_bod_fis CHECK (inventario_bodega_cantidad_fisica >= 0),
    CONSTRAINT ck_inv_bod_res CHECK (inventario_bodega_cantidad_reservada >= 0)
);

CREATE TABLE movimiento_inventario (
    movimiento_inventario_id_movimiento                          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    movimiento_inventario_fecha_hora                             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    movimiento_inventario_cantidad                               NUMERIC(12,4) NOT NULL,
    movimiento_inventario_estado                                 VARCHAR(50)   NOT NULL,
    material_sku                                                 VARCHAR(16)   NOT NULL,
    bodega_id_bodega                                             BIGINT,
    lote_id_lote                                                 BIGINT,
    -- FK blanda hacia terreno/produccion
    proyecto_id_proyecto                                         BIGINT,
    factura_compra_id_factura_compra                             BIGINT,
    usuario_id_usuario                                           BIGINT        NOT NULL,
    movimiento_inventario_tipo_movimiento_id_tipo_movimiento     BIGINT        NOT NULL,
    movimiento_inventario_motivo_movimiento_id_motivo_movimiento BIGINT,
    CONSTRAINT pk_mov_inv PRIMARY KEY (movimiento_inventario_id_movimiento),
    CONSTRAINT ck_mov_inv_cant CHECK (movimiento_inventario_cantidad >= 0)
);

CREATE TABLE reporte_movimiento_inventario (
    movimiento_inventario_id_movimiento  BIGINT NOT NULL,
    reporte_id_reporte                   BIGINT NOT NULL,
    CONSTRAINT pk_rep_mov PRIMARY KEY (movimiento_inventario_id_movimiento, reporte_id_reporte)
);

CREATE TABLE alerta_inventario (
    alerta_inventario_id_alerta                  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    alerta_inventario_mensaje                    TEXT,
    alerta_inventario_fecha_generacion           TIMESTAMPTZ NOT NULL DEFAULT now(),
    alerta_inventario_fecha_est_agotamiento      DATE,
    alerta_inventario_estado                     VARCHAR(50) NOT NULL,
    material_sku                                 VARCHAR(16) NOT NULL,
    proveedor_id_proveedor                       BIGINT,
    alerta_inventario_tipo_alerta_id_tipo_alerta BIGINT      NOT NULL,
    historial_alerta_id_historial                BIGINT,
    CONSTRAINT pk_alerta_inv PRIMARY KEY (alerta_inventario_id_alerta)
);

CREATE TABLE reserva_inventario (
    reserva_inventario_id_reserva         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    reserva_inventario_cantidad_reservada NUMERIC(12,4) NOT NULL,
    reserva_inventario_fecha_reserva      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    reserva_inventario_fecha_liberacion   TIMESTAMPTZ,
    reserva_inventario_estado_reserva     VARCHAR(50)   NOT NULL,
    material_sku                          VARCHAR(16)   NOT NULL,
    -- FK blandas hacia terreno/produccion
    proyecto_id_proyecto                  BIGINT,
    orden_trabajo_id_orden                BIGINT,
    CONSTRAINT pk_reserva_inv PRIMARY KEY (reserva_inventario_id_reserva),
    CONSTRAINT ck_res_cant CHECK (reserva_inventario_cantidad_reservada >= 0)
);

CREATE TABLE alerta_faltante_pedido (
    alerta_faltante_pedido_id_alerta_faltante  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    alerta_faltante_pedido_fecha_generacion    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    alerta_faltante_pedido_cantidad_disponible NUMERIC(12,4),
    alerta_faltante_pedido_cantidad_requerida  NUMERIC(12,4),
    alerta_faltante_pedido_horas_anticipacion  INTEGER,
    alerta_faltante_pedido_estado              VARCHAR(50)   NOT NULL,
    material_sku                               VARCHAR(16)   NOT NULL,
    proveedor_id_proveedor                     BIGINT,
    usuario_id_usuario                         BIGINT,
    -- FK blanda hacia terreno/produccion
    proyecto_id_proyecto                       BIGINT,
    CONSTRAINT pk_alert_falt PRIMARY KEY (alerta_faltante_pedido_id_alerta_faltante),
    CONSTRAINT ck_afp_disp CHECK (alerta_faltante_pedido_cantidad_disponible >= 0),
    CONSTRAINT ck_afp_req  CHECK (alerta_faltante_pedido_cantidad_requerida >= 0),
    CONSTRAINT ck_afp_hrs  CHECK (alerta_faltante_pedido_horas_anticipacion >= 0)
);

CREATE TABLE notificacion (
    notificacion_id_notificacion   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    notificacion_tipo_notificacion VARCHAR(150),
    notificacion_mensaje           TEXT,
    notificacion_fecha_generacion  TIMESTAMPTZ NOT NULL DEFAULT now(),
    notificacion_estado_lectura    VARCHAR(50) NOT NULL DEFAULT 'no_leida',
    notificacion_origen            VARCHAR(150),
    alerta_inventario_id_alerta    BIGINT,
    usuario_id_usuario             BIGINT      NOT NULL,
    CONSTRAINT pk_notif PRIMARY KEY (notificacion_id_notificacion)
);

CREATE TABLE preparacion_pedido (
    preparacion_pedido_id_preparacion  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    preparacion_pedido_observacion     TEXT,
    reserva_inventario_id_reserva      BIGINT NOT NULL,
    usuario_id_usuario                 BIGINT,
    CONSTRAINT pk_prep_ped PRIMARY KEY (preparacion_pedido_id_preparacion)
);

CREATE TABLE preparacion_pedido_estado (
    preparacion_pedido_estado_id_estado_preparacion  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    preparacion_pedido_estado_nombre_estado          VARCHAR(100) NOT NULL,
    preparacion_pedido_estado_timestamp_accion       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    preparacion_pedido_id_preparacion                BIGINT       NOT NULL,
    CONSTRAINT pk_prep_ped_est PRIMARY KEY (preparacion_pedido_estado_id_estado_preparacion)
);

CREATE TABLE perfil_permiso (
    perfil_id_perfil      BIGINT  NOT NULL,
    permiso_id_permiso    BIGINT  NOT NULL,
    perfil_permiso_activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_perfil_permiso PRIMARY KEY (perfil_id_perfil, permiso_id_permiso)
);

-- NOTA: usuario ya no referencia empleado con FK formal.
-- empleado_rut_empleado se mantiene como referencia blanda hacia finanzas.schema.
CREATE TABLE usuario (
    usuario_id_usuario                               BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    usuario_fecha_de_ultima_edicion                  TIMESTAMPTZ,
    usuario_rut_usuario                              VARCHAR(12),
    usuario_fecha_de_creacion                        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_correo                                   VARCHAR(254),
    usuario_username                                 VARCHAR(100) NOT NULL,
    usuario_estado_cuenta                            VARCHAR(50)  NOT NULL,
    usuario_fecha_ultima_conexion                    TIMESTAMPTZ,
    usuario_nombre_completo_primer_nombre_usuario    VARCHAR(100),
    usuario_nombre_completo_segundo_nombre_usuario   VARCHAR(100),
    usuario_nombre_completo_primer_apellido_usuario  VARCHAR(100),
    usuario_nombre_completo_segundo_apellido_usuario VARCHAR(100),
    usuario_es_gerencia                              BOOLEAN NOT NULL DEFAULT FALSE,
    gerencia                                         TEXT,
    usuario_es_tecnico                               BOOLEAN NOT NULL DEFAULT FALSE,
    tecnico                                          TEXT,
    usuario_es_jop                                   BOOLEAN NOT NULL DEFAULT FALSE,
    jop                                              TEXT,
    usuario_es_administrador                         BOOLEAN NOT NULL DEFAULT FALSE,
    administrador                                    TEXT,
    usuario_es_secretaria                            BOOLEAN NOT NULL DEFAULT FALSE,
    secretaria                                       TEXT,
    perfil_id_perfil                                 BIGINT,
    -- FK blanda hacia finanzas.empleado (sin constraint cross-schema)
    empleado_rut_empleado                            VARCHAR(12),
    CONSTRAINT pk_usuario PRIMARY KEY (usuario_id_usuario),
    CONSTRAINT uk_usuario_username UNIQUE (usuario_username),
    CONSTRAINT uk_usuario_correo   UNIQUE (usuario_correo),
    CONSTRAINT uk_usuario_rut      UNIQUE (usuario_rut_usuario)
);

CREATE TABLE usuario_contrasena (
    usuario_id_usuario BIGINT NOT NULL,
    usuario_contrasena TEXT   NOT NULL,
    CONSTRAINT pk_usr_pass PRIMARY KEY (usuario_id_usuario)
);

CREATE TABLE orden_trabajo (
    orden_trabajo_id_orden                           BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    orden_trabajo_fecha_hora                         TIMESTAMPTZ NOT NULL DEFAULT now(),
    orden_trabajo_estado                             VARCHAR(50) NOT NULL,
    -- FK blandas hacia terreno
    especificaciones_puerta_id_especificacion_puerta BIGINT,
    proyecto_id_proyecto                             BIGINT,
    area_trabajo_id_area                             BIGINT      NOT NULL,
    usuario_id_usuario                               BIGINT      NOT NULL,
    CONSTRAINT pk_orden_trab PRIMARY KEY (orden_trabajo_id_orden)
);

CREATE TABLE material_orden_trabajo (
    material_sku                            VARCHAR(16)   NOT NULL,
    orden_trabajo_id_orden                  BIGINT        NOT NULL,
    material_orden_trabajo_consumo_estimado NUMERIC(12,4),
    material_orden_trabajo_consumo_real     NUMERIC(12,4),
    CONSTRAINT pk_mat_ot PRIMARY KEY (material_sku, orden_trabajo_id_orden),
    CONSTRAINT ck_mat_ot_est  CHECK (material_orden_trabajo_consumo_estimado >= 0),
    CONSTRAINT ck_mat_ot_real CHECK (material_orden_trabajo_consumo_real >= 0)
);

CREATE TABLE insumo_estandar_proceso (
    insumo_estandar_proceso_id_insumo_estandar BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    insumo_estandar_proceso_cantidad_estandar  NUMERIC(12,4) NOT NULL,
    insumo_estandar_proceso_observacion        TEXT,
    insumo_estandar_proceso_activo             BOOLEAN NOT NULL DEFAULT TRUE,
    material_sku                               VARCHAR(16) NOT NULL,
    area_trabajo_id_area                       BIGINT      NOT NULL,
    CONSTRAINT pk_ins_est PRIMARY KEY (insumo_estandar_proceso_id_insumo_estandar),
    CONSTRAINT ck_ins_est_cant CHECK (insumo_estandar_proceso_cantidad_estandar >= 0)
);

CREATE TABLE reporte (
    reporte_id_reporte          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    reporte_periodo_fin         DATE         NOT NULL,
    reporte_fecha_generacion    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    reporte_formato_exportacion VARCHAR(50),
    reporte_estado              VARCHAR(50)  NOT NULL,
    reporte_tipo_reporte        VARCHAR(150) NOT NULL,
    reporte_periodo_inicio      DATE         NOT NULL,
    usuario_id_usuario          BIGINT       NOT NULL,
    CONSTRAINT pk_reporte PRIMARY KEY (reporte_id_reporte)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 3 — FOREIGN KEYS INTERNAS
-- ══════════════════════════════════════════════════════════════

ALTER TABLE material_clasificacion_subcategoria
    ADD CONSTRAINT fk_sub_cat
        FOREIGN KEY (material_clasificacion_categoria_id)
        REFERENCES material_clasificacion_categoria(material_clasificacion_categoria_id);

ALTER TABLE material_clasificacion_nivel_especifico
    ADD CONSTRAINT fk_niv_sub
        FOREIGN KEY (material_clasificacion_subcategoria_id)
        REFERENCES material_clasificacion_subcategoria(material_clasificacion_subcategoria_id);

ALTER TABLE alerta_inventario_tipo_alerta
    ADD CONSTRAINT fk_tipo_alert_niv
        FOREIGN KEY (alerta_inventario_nivel_prioridad_id)
        REFERENCES alerta_inventario_nivel_prioridad(alerta_inventario_nivel_prioridad_id_nivel_prioridad);

ALTER TABLE movimiento_inventario_motivo_movimiento
    ADD CONSTRAINT fk_motivo_clas
        FOREIGN KEY (movimiento_inventario_clasificacion_salida_id_clasificacion_salida)
        REFERENCES movimiento_inventario_clasificacion_salida(movimiento_inventario_clasificacion_salida_id_clasificacion_salida);

ALTER TABLE material
    ADD CONSTRAINT fk_mat_cat_gen
        FOREIGN KEY (material_categoria_general_id_categoria_general)
        REFERENCES material_categoria_general(material_categoria_general_id_categoria_general),
    ADD CONSTRAINT fk_mat_cat_func
        FOREIGN KEY (material_categoria_funcional_id_categoria_funcional)
        REFERENCES material_categoria_funcional(material_categoria_funcional_id_categoria_funcional),
    ADD CONSTRAINT fk_mat_niv_esp
        FOREIGN KEY (material_clasificacion_nivel_especifico_id)
        REFERENCES material_clasificacion_nivel_especifico(material_clasificacion_nivel_especifico_id),
    ADD CONSTRAINT fk_mat_unidad
        FOREIGN KEY (material_unidad_medida_id_unidad_medida)
        REFERENCES material_unidad_medida(material_unidad_medida_id_unidad_medida);

ALTER TABLE material_codigo_barras
    ADD CONSTRAINT fk_cod_bar_mat
        FOREIGN KEY (material_sku) REFERENCES material(material_sku);

ALTER TABLE material_proveedor
    ADD CONSTRAINT fk_mat_prov_mat  FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_mat_prov_prov FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor);

ALTER TABLE material_producto_terminado
    ADD CONSTRAINT fk_mat_prod_mat  FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_mat_prod_prod FOREIGN KEY (producto_terminado_id_producto) REFERENCES producto_terminado(producto_terminado_id_producto);

ALTER TABLE proveedor_contacto_telefono
    ADD CONSTRAINT fk_prov_tel_prov FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor);

ALTER TABLE proveedor_contacto_correo
    ADD CONSTRAINT fk_prov_cor_prov FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor);

ALTER TABLE anaquel
    ADD CONSTRAINT fk_anaquel_bodega FOREIGN KEY (bodega_id_bodega) REFERENCES bodega(bodega_id_bodega);

ALTER TABLE factura_compra
    ADD CONSTRAINT fk_fact_prov       FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor),
    ADD CONSTRAINT fk_fact_tipocambio FOREIGN KEY (factura_compra_tipo_cambio_id_tipo_cambio) REFERENCES factura_compra_tipo_cambio(factura_compra_tipo_cambio_id_tipo_cambio);

ALTER TABLE lote
    ADD CONSTRAINT fk_lote_prov FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor),
    ADD CONSTRAINT fk_lote_fact FOREIGN KEY (factura_compra_id_factura) REFERENCES factura_compra(factura_compra_id_factura);
    -- proyecto_id_proyecto: FK blanda hacia terreno

ALTER TABLE lote_fecha_pedido
    ADD CONSTRAINT fk_lote_fp_lote FOREIGN KEY (lote_id_lote) REFERENCES lote(lote_id_lote);

ALTER TABLE inventario_bodega
    ADD CONSTRAINT fk_inv_bod_mat    FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_inv_bod_lote   FOREIGN KEY (lote_id_lote) REFERENCES lote(lote_id_lote),
    ADD CONSTRAINT fk_inv_bod_bodega FOREIGN KEY (bodega_id_bodega) REFERENCES bodega(bodega_id_bodega);

ALTER TABLE movimiento_inventario
    ADD CONSTRAINT fk_mov_mat    FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_mov_bodega FOREIGN KEY (bodega_id_bodega) REFERENCES bodega(bodega_id_bodega),
    ADD CONSTRAINT fk_mov_lote   FOREIGN KEY (lote_id_lote) REFERENCES lote(lote_id_lote),
    ADD CONSTRAINT fk_mov_fact   FOREIGN KEY (factura_compra_id_factura_compra) REFERENCES factura_compra(factura_compra_id_factura),
    ADD CONSTRAINT fk_mov_tipo   FOREIGN KEY (movimiento_inventario_tipo_movimiento_id_tipo_movimiento)
                                 REFERENCES movimiento_inventario_tipo_movimiento(movimiento_inventario_tipo_movimiento_id_tipo_movimiento),
    ADD CONSTRAINT fk_mov_motivo FOREIGN KEY (movimiento_inventario_motivo_movimiento_id_motivo_movimiento)
                                 REFERENCES movimiento_inventario_motivo_movimiento(movimiento_inventario_motivo_movimiento_id_motivo_movimiento),
    ADD CONSTRAINT fk_mov_usr    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);
    -- proyecto_id_proyecto: FK blanda hacia terreno

ALTER TABLE reporte_movimiento_inventario
    ADD CONSTRAINT fk_rep_mov_mov FOREIGN KEY (movimiento_inventario_id_movimiento)
                                  REFERENCES movimiento_inventario(movimiento_inventario_id_movimiento),
    ADD CONSTRAINT fk_rep_mov_rep FOREIGN KEY (reporte_id_reporte) REFERENCES reporte(reporte_id_reporte);

ALTER TABLE alerta_inventario
    ADD CONSTRAINT fk_alert_mat      FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_alert_prov     FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor),
    ADD CONSTRAINT fk_alert_tipo     FOREIGN KEY (alerta_inventario_tipo_alerta_id_tipo_alerta)
                                     REFERENCES alerta_inventario_tipo_alerta(alerta_inventario_tipo_alerta_id_tipo_alerta),
    ADD CONSTRAINT fk_alert_historial FOREIGN KEY (historial_alerta_id_historial)
                                     REFERENCES historial_alerta(historial_alerta_id_historial);

ALTER TABLE reserva_inventario
    ADD CONSTRAINT fk_res_mat FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_res_ot  FOREIGN KEY (orden_trabajo_id_orden) REFERENCES orden_trabajo(orden_trabajo_id_orden);
    -- proyecto_id_proyecto: FK blanda hacia terreno

ALTER TABLE alerta_faltante_pedido
    ADD CONSTRAINT fk_afp_mat  FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_afp_prov FOREIGN KEY (proveedor_id_proveedor) REFERENCES proveedor(proveedor_id_proveedor),
    ADD CONSTRAINT fk_afp_usr  FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);
    -- proyecto_id_proyecto: FK blanda hacia terreno

ALTER TABLE notificacion
    ADD CONSTRAINT fk_notif_alert FOREIGN KEY (alerta_inventario_id_alerta) REFERENCES alerta_inventario(alerta_inventario_id_alerta),
    ADD CONSTRAINT fk_notif_usr   FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);

ALTER TABLE preparacion_pedido
    ADD CONSTRAINT fk_prep_res FOREIGN KEY (reserva_inventario_id_reserva) REFERENCES reserva_inventario(reserva_inventario_id_reserva),
    ADD CONSTRAINT fk_prep_usr FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);

ALTER TABLE preparacion_pedido_estado
    ADD CONSTRAINT fk_prep_est_prep FOREIGN KEY (preparacion_pedido_id_preparacion)
                                    REFERENCES preparacion_pedido(preparacion_pedido_id_preparacion);

ALTER TABLE perfil_permiso
    ADD CONSTRAINT fk_pp_perfil  FOREIGN KEY (perfil_id_perfil)  REFERENCES perfil(perfil_id_perfil),
    ADD CONSTRAINT fk_pp_permiso FOREIGN KEY (permiso_id_permiso) REFERENCES permiso(permiso_id_permiso);

-- usuario.perfil_id_perfil → perfil (interna)
-- usuario.empleado_rut_empleado → FK blanda hacia finanzas.empleado (sin constraint)
ALTER TABLE usuario
    ADD CONSTRAINT fk_usr_perfil FOREIGN KEY (perfil_id_perfil) REFERENCES perfil(perfil_id_perfil);

ALTER TABLE usuario_contrasena
    ADD CONSTRAINT fk_usr_pass FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);

ALTER TABLE orden_trabajo
    ADD CONSTRAINT fk_ot_area FOREIGN KEY (area_trabajo_id_area) REFERENCES area_trabajo(area_trabajo_id_area),
    ADD CONSTRAINT fk_ot_usr  FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);
    -- proyecto_id_proyecto, especificaciones_puerta: FK blandas hacia terreno

ALTER TABLE material_orden_trabajo
    ADD CONSTRAINT fk_mot_mat FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_mot_ot  FOREIGN KEY (orden_trabajo_id_orden) REFERENCES orden_trabajo(orden_trabajo_id_orden);

ALTER TABLE insumo_estandar_proceso
    ADD CONSTRAINT fk_ins_mat  FOREIGN KEY (material_sku) REFERENCES material(material_sku),
    ADD CONSTRAINT fk_ins_area FOREIGN KEY (area_trabajo_id_area) REFERENCES area_trabajo(area_trabajo_id_area);

ALTER TABLE reporte
    ADD CONSTRAINT fk_rep_usr FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(usuario_id_usuario);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 4 — ÍNDICES
-- ══════════════════════════════════════════════════════════════

CREATE INDEX idx_material_estado      ON material(material_estado);
CREATE INDEX idx_material_cat_gen     ON material(material_categoria_general_id_categoria_general);
CREATE INDEX idx_material_unidad      ON material(material_unidad_medida_id_unidad_medida);
CREATE INDEX idx_material_niv_esp     ON material(material_clasificacion_nivel_especifico_id);
CREATE INDEX idx_material_rotativo    ON material(material_es_rotativo);

CREATE INDEX idx_mov_inv_sku          ON movimiento_inventario(material_sku);
CREATE INDEX idx_mov_inv_fecha        ON movimiento_inventario(movimiento_inventario_fecha_hora);
CREATE INDEX idx_mov_inv_proyecto     ON movimiento_inventario(proyecto_id_proyecto);
CREATE INDEX idx_mov_inv_lote         ON movimiento_inventario(lote_id_lote);
CREATE INDEX idx_mov_inv_usuario      ON movimiento_inventario(usuario_id_usuario);
CREATE INDEX idx_mov_inv_tipo         ON movimiento_inventario(movimiento_inventario_tipo_movimiento_id_tipo_movimiento);
CREATE INDEX idx_mov_inv_bodega       ON movimiento_inventario(bodega_id_bodega);

CREATE INDEX idx_lote_proveedor       ON lote(proveedor_id_proveedor);
CREATE INDEX idx_lote_factura         ON lote(factura_compra_id_factura);
CREATE INDEX idx_lote_proyecto        ON lote(proyecto_id_proyecto);
CREATE INDEX idx_lote_fp              ON lote_fecha_pedido(lote_id_lote);

CREATE INDEX idx_inv_bod_sku          ON inventario_bodega(material_sku);
CREATE INDEX idx_inv_bod_bodega       ON inventario_bodega(bodega_id_bodega);

CREATE INDEX idx_reserva_sku          ON reserva_inventario(material_sku);
CREATE INDEX idx_reserva_proyecto     ON reserva_inventario(proyecto_id_proyecto);
CREATE INDEX idx_reserva_orden        ON reserva_inventario(orden_trabajo_id_orden);

CREATE INDEX idx_alerta_sku           ON alerta_inventario(material_sku);
CREATE INDEX idx_alerta_estado        ON alerta_inventario(alerta_inventario_estado);
CREATE INDEX idx_alerta_fecha         ON alerta_inventario(alerta_inventario_fecha_generacion);

CREATE INDEX idx_notif_usuario        ON notificacion(usuario_id_usuario);
CREATE INDEX idx_notif_alerta         ON notificacion(alerta_inventario_id_alerta);

CREATE INDEX idx_ot_area              ON orden_trabajo(area_trabajo_id_area);
CREATE INDEX idx_ot_proyecto          ON orden_trabajo(proyecto_id_proyecto);
CREATE INDEX idx_ot_usuario           ON orden_trabajo(usuario_id_usuario);

CREATE INDEX idx_afp_sku              ON alerta_faltante_pedido(material_sku);
CREATE INDEX idx_afp_proyecto         ON alerta_faltante_pedido(proyecto_id_proyecto);

CREATE INDEX idx_ins_mat              ON insumo_estandar_proceso(material_sku);
CREATE INDEX idx_ins_area             ON insumo_estandar_proceso(area_trabajo_id_area);

CREATE INDEX idx_usr_perfil           ON usuario(perfil_id_perfil);
CREATE INDEX idx_usr_emp              ON usuario(empleado_rut_empleado);

CREATE INDEX idx_prep_reserva         ON preparacion_pedido(reserva_inventario_id_reserva);
CREATE INDEX idx_prep_est             ON preparacion_pedido_estado(preparacion_pedido_id_preparacion);

CREATE INDEX idx_rep_usuario          ON reporte(usuario_id_usuario);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 5 — COMENTARIOS
-- ══════════════════════════════════════════════════════════════

COMMENT ON SCHEMA inventario IS 'Módulo Inventario — Sistema Puertas Blindadas — Grupo 14';
COMMENT ON TABLE material IS 'Entidad central. SKU alfanumérico 4-16 chars. RN-PB-056 a 062.';
COMMENT ON TABLE lote IS 'Trazabilidad FIFO. proyecto_id_proyecto = FK blanda hacia terreno.';
COMMENT ON TABLE inventario_bodega IS 'Tabla ternaria MATERIAL-LOTE-BODEGA. Stock físico con trazabilidad de lote.';
COMMENT ON TABLE movimiento_inventario IS 'Evento central de stock. RN-PB-067 a 073. FKs blandas: proyecto.';
COMMENT ON TABLE usuario IS 'Dueño del módulo seguridad/compartido. empleado_rut_empleado es FK blanda hacia finanzas.';
COMMENT ON TABLE reporte IS 'reporte_tipo_reporte mantiene VARCHAR(150).';

COMMENT ON COLUMN lote.proyecto_id_proyecto IS 'FK blanda hacia terreno.proyecto — sin constraint cross-schema';
COMMENT ON COLUMN movimiento_inventario.proyecto_id_proyecto IS 'FK blanda hacia terreno.proyecto';
COMMENT ON COLUMN orden_trabajo.proyecto_id_proyecto IS 'FK blanda hacia terreno.proyecto';
COMMENT ON COLUMN orden_trabajo.especificaciones_puerta_id_especificacion_puerta IS 'FK blanda hacia terreno.especificacion_puerta';
COMMENT ON COLUMN reserva_inventario.proyecto_id_proyecto IS 'FK blanda hacia terreno.proyecto';
COMMENT ON COLUMN alerta_faltante_pedido.proyecto_id_proyecto IS 'FK blanda hacia terreno.proyecto';
COMMENT ON COLUMN usuario.empleado_rut_empleado IS 'FK blanda hacia finanzas.empleado — sin constraint cross-schema';

COMMIT;

-- ============================================================
-- Sistema Puertas Blindadas — Módulo Terreno
-- SQL CORREGIDO v2
-- Schema: terreno
--
-- CAMBIOS v2 respecto al SQL entregado por el grupo Terreno:
-- - ELIMINADAS (no le pertenecen):
--     empleado       → dueño: finanzas
--     perfil         → dueño: inventario
--     perfil_permiso → dueño: inventario
--     permiso        → dueño: inventario
--     usuario        → dueño: inventario
--     material       → dueño: inventario
--     cliente_financiero → dueño: finanzas
--     ficha_cliente      → dueño: finanzas
--     tipo_cliente       → dueño: finanzas
-- - CORREGIDOS: nombres alineados con el modelo conjunto
--     Especificacion_puerta → especificacion_puerta
--     Servicio_terreno_herramientas_materiales → servicio_terreno_herramientas_materiales
-- - CONVENCIÓN: snake_case sin comillas dobles (alineado con el conjunto)
-- - evidencia_terreno → en MongoDB (no incluida en este SQL)
-- - Terreno crea y gestiona la tabla cliente
-- - Las referencias a usuario, empleado, material, proveedor
--   son FK blandas hacia los schemas dueños correspondientes
-- ============================================================

BEGIN;

DROP SCHEMA IF EXISTS terreno CASCADE;
CREATE SCHEMA terreno;
SET search_path TO terreno;

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 1 — CLIENTE (dueño: terreno)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE cliente (
    rut_cliente                                      VARCHAR(12) NOT NULL,
    razon_social                                     TEXT        NOT NULL,
    contacto_principal                               TEXT        NOT NULL,
    correo                                           TEXT        NOT NULL,
    telefono                                         TEXT        NOT NULL,
    es_cliente_b2c                                   BOOLEAN     NOT NULL,
    cliente_b2c_rut                                  VARCHAR(12),
    cliente_b2c_correo                               TEXT,
    cliente_b2c_primer_nombre                        TEXT,
    cliente_b2c_segundo_nombre                       TEXT,
    cliente_b2c_primer_apellido                      TEXT,
    cliente_b2c_segundo_apellido                     TEXT,
    cliente_b2c_telefono_contacto                    TEXT,
    cliente_b2c_fecha_registro                       DATE,
    cliente_b2c_telefono_contacto_adicional          TEXT,
    cliente_b2c_fecha_ultima_edicion                 DATE,
    es_cliente_b2b                                   BOOLEAN     NOT NULL,
    cliente_b2b_fecha_ultima_edicion                 DATE,
    cliente_b2b_correo_institucional                 TEXT,
    cliente_b2b_fecha_registro                       DATE,
    cliente_b2b_telefono_corporativo                 TEXT,
    cliente_b2b_razon_social                         TEXT,
    cliente_b2b_rut_empresa                          VARCHAR(12),
    cliente_b2b_telefono_corp_adicional              TEXT,
    cliente_b2b_representante_legal_primer_nombre    TEXT,
    cliente_b2b_representante_legal_segundo_nombre   TEXT,
    cliente_b2b_representante_legal_primer_apellido  TEXT,
    cliente_b2b_representante_legal_segundo_apellido TEXT,
    CONSTRAINT pk_cliente PRIMARY KEY (rut_cliente)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 2 — ESPECIFICACIÓN DE PUERTA
-- ══════════════════════════════════════════════════════════════

CREATE TABLE medidas_puerta (
    id_medidas                                BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    medidas_marco_ancho                       NUMERIC(12,4) NOT NULL,
    medidas_marco_alto                        NUMERIC(12,4) NOT NULL,
    medidas_marco_espesor                     NUMERIC(12,4) NOT NULL,
    medidas_vano_vertical_ancho               NUMERIC(12,4) NOT NULL,
    medidas_vano_vertical_alto                NUMERIC(12,4) NOT NULL,
    medidas_vano_vertical_espesor             NUMERIC(12,4) NOT NULL,
    medidas_vano_horizontal_ancho             NUMERIC(12,4) NOT NULL,
    medidas_vano_horizontal_alto              NUMERIC(12,4) NOT NULL,
    medidas_vano_horizontal_espesor           NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_vertical_alto         NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_vertical_ancho        NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_vertical_espesor      NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_horizontal_alto       NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_horizontal_ancho      NUMERIC(12,4) NOT NULL,
    medidas_alojamiento_horizontal_espesor    NUMERIC(12,4) NOT NULL,
    alojamiento_vertical                      NUMERIC(12,4) NOT NULL,
    medidas_de_marco_ancho                    NUMERIC(12,4) NOT NULL,
    medidas_de_marco_alto                     NUMERIC(12,4) NOT NULL,
    medidas_de_marco_espesor                  NUMERIC(12,4) NOT NULL,
    CONSTRAINT pk_medidas_puerta PRIMARY KEY (id_medidas)
);

CREATE TABLE especificacion_puerta (
    id_especificacion_puerta    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    modelo_puerta               TEXT    NOT NULL,
    zona                        TEXT    NOT NULL,
    sentido_apertura            TEXT    NOT NULL,
    materialidad_vano           TEXT    NOT NULL,
    materialidad_marco_actual   TEXT    NOT NULL,
    solucion_marco              TEXT    NOT NULL,
    hoja_pasiva                 TEXT    NOT NULL,
    hoja_activa                 TEXT    NOT NULL,
    diseno_puerta               TEXT    NOT NULL,
    observaciones_de_diseno     TEXT,
    cubrejuntas                 BOOLEAN NOT NULL,
    bisagras                    TEXT    NOT NULL,
    observaciones               TEXT,
    id_medidas                  BIGINT  NOT NULL,
    CONSTRAINT pk_especificacion_puerta PRIMARY KEY (id_especificacion_puerta),
    CONSTRAINT uk_esp_puerta_medidas UNIQUE (id_medidas)
);

CREATE TABLE hoja_simple (
    id_especificacion_puerta         BIGINT        NOT NULL,
    medidas_vertical_alto            NUMERIC(12,4) NOT NULL,
    medidas_vertical_ancho           NUMERIC(12,4) NOT NULL,
    medidas_vertical_espesor         NUMERIC(12,4) NOT NULL,
    medidas_horizontal_alto          NUMERIC(12,4) NOT NULL,
    medidas_horizontal_ancho         NUMERIC(12,4) NOT NULL,
    medidas_horizontal_espesor       NUMERIC(12,4) NOT NULL,
    CONSTRAINT pk_hoja_simple PRIMARY KEY (id_especificacion_puerta)
);

CREATE TABLE hoja_doble (
    id_especificacion_puerta             BIGINT        NOT NULL,
    medidas_derecha                      TEXT          NOT NULL,
    medidas_derecha_vertical_alto        NUMERIC(12,4) NOT NULL,
    medidas_derecha_vertical_ancho       NUMERIC(12,4) NOT NULL,
    medidas_derecha_vertical_espesor     NUMERIC(12,4) NOT NULL,
    medidas_derecha_horizontal_alto      NUMERIC(12,4) NOT NULL,
    medidas_derecha_horizontal_ancho     NUMERIC(12,4) NOT NULL,
    medidas_derecha_horizontal_espesor   NUMERIC(12,4) NOT NULL,
    actividad_izquierda                  TEXT          NOT NULL,
    medidas_izquierda_vertical_alto      NUMERIC(12,4) NOT NULL,
    medidas_izquierda_vertical_ancho     NUMERIC(12,4) NOT NULL,
    medidas_izquierda_vertical_espesor   NUMERIC(12,4) NOT NULL,
    medidas_izquierda_horizontal_alto    NUMERIC(12,4) NOT NULL,
    medidas_izquierda_horizontal_ancho   NUMERIC(12,4) NOT NULL,
    medidas_izquierda_horizontal_espesor NUMERIC(12,4) NOT NULL,
    CONSTRAINT pk_hoja_doble PRIMARY KEY (id_especificacion_puerta)
);

CREATE TABLE especificacion_metalmecanica (
    id_metalmecanica         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    bastidor                 TEXT NOT NULL,
    cerradura                TEXT NOT NULL,
    manillon                 TEXT NOT NULL,
    pernos_fijos             TEXT NOT NULL,
    manilla                  TEXT NOT NULL,
    herraje                  TEXT NOT NULL,
    cerrojo                  TEXT NOT NULL,
    ojo                      TEXT NOT NULL,
    otros                    TEXT NOT NULL,
    id_especificacion_puerta BIGINT NOT NULL,
    CONSTRAINT pk_esp_metalmecanica PRIMARY KEY (id_metalmecanica),
    CONSTRAINT uk_esp_metal_puerta UNIQUE (id_especificacion_puerta)
);

CREATE TABLE especificacion_terminaciones (
    id_terminacion           BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    herrajes                 TEXT          NOT NULL,
    pletina                  NUMERIC(12,4) NOT NULL,
    funda                    NUMERIC(12,4) NOT NULL,
    medida_final             NUMERIC(12,4) NOT NULL,
    manilla                  NUMERIC(12,4) NOT NULL,
    marco_metalico           NUMERIC(12,4) NOT NULL,
    bisagras                 NUMERIC(12,4) NOT NULL,
    molduras                 TEXT          NOT NULL,
    rebaje                   TEXT          NOT NULL,
    canterias                TEXT          NOT NULL,
    enchape                  TEXT          NOT NULL,
    id_especificacion_puerta BIGINT        NOT NULL,
    CONSTRAINT pk_esp_terminaciones PRIMARY KEY (id_terminacion),
    CONSTRAINT uk_esp_term_puerta UNIQUE (id_especificacion_puerta)
);

-- FK blanda: sku_material → inventario.material
CREATE TABLE detalles_herraje (
    id_detalles_herraje      BIGINT  NOT NULL,
    ubicacion                TEXT    NOT NULL,
    color                    TEXT    NOT NULL,
    cantidad                 INTEGER NOT NULL,
    observacion              TEXT,
    -- FK blanda hacia inventario.material
    sku_material             BIGINT,
    id_especificacion_puerta BIGINT  NOT NULL,
    CONSTRAINT pk_detalles_herraje PRIMARY KEY (id_detalles_herraje)
);

CREATE TABLE adicionales_pagados (
    id_adicionales           BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    retiro_escombros         BOOLEAN       NOT NULL,
    retiro_puerta_actual     BOOLEAN       NOT NULL,
    alarma                   BOOLEAN       NOT NULL,
    subida_escalera          TEXT          NOT NULL,
    endolados                BOOLEAN       NOT NULL,
    pilastras_alto           NUMERIC(12,4) NOT NULL,
    pilastras_ancho          NUMERIC(12,4) NOT NULL,
    pilastras_espesor        NUMERIC(12,4) NOT NULL,
    observaciones            TEXT,
    id_especificacion_puerta BIGINT        NOT NULL,
    CONSTRAINT pk_adicionales_pagados PRIMARY KEY (id_adicionales),
    CONSTRAINT uk_adicionales_puerta UNIQUE (id_especificacion_puerta)
);

CREATE TABLE historial_cambio_orden_trabajo (
    id_cambio                BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    version_nueva            TEXT      NOT NULL,
    version_antigua          TEXT      NOT NULL,
    fecha_hora               TIMESTAMP NOT NULL,
    descripcion              TEXT      NOT NULL,
    id_especificacion_puerta BIGINT    NOT NULL,
    CONSTRAINT pk_historial_cambio PRIMARY KEY (id_cambio)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 3 — PROYECTO Y OBRA
-- ══════════════════════════════════════════════════════════════

CREATE TABLE proyecto (
    id_proyecto          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    codigo_proyecto      TEXT    NOT NULL,
    nombre_referencia    TEXT    NOT NULL,
    fecha_instalacion    DATE    NOT NULL,
    fecha_ingreso        DATE    NOT NULL,
    estado_operacional   TEXT    NOT NULL,
    estado_produccion    TEXT    NOT NULL,
    rut_cliente          VARCHAR(12) NOT NULL,
    CONSTRAINT pk_proyecto PRIMARY KEY (id_proyecto)
);

CREATE TABLE obra (
    id_obra                  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_obra              TEXT    NOT NULL,
    direccion_obra           TEXT    NOT NULL,
    comuna                   TEXT    NOT NULL,
    region                   TEXT    NOT NULL,
    tipo_obra                TEXT    NOT NULL,
    fecha_de_creacion        DATE    NOT NULL,
    fecha_de_ultima_edicion  DATE    NOT NULL,
    estado                   TEXT    NOT NULL,
    cantidad_puerta          INTEGER NOT NULL,
    referencia               TEXT    NOT NULL,
    observaciones            TEXT,
    rut_cliente              VARCHAR(12) NOT NULL,
    id_especificacion_puerta BIGINT      NOT NULL,
    CONSTRAINT pk_obra PRIMARY KEY (id_obra)
);

CREATE TABLE especificacion_proyecto_terreno (
    id_especificacion_proyecto_terreno  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    estado_operacional                  TEXT NOT NULL,
    estado_produccion                   TEXT NOT NULL,
    estado_instalacion                  TEXT NOT NULL,
    fecha_inicio                        DATE NOT NULL,
    fecha_cierre_operativo              DATE NOT NULL,
    observacion_estado                  TEXT,
    conformidad_cliente                 TEXT NOT NULL,
    id_especificacion_puerta            BIGINT NOT NULL,
    CONSTRAINT pk_esp_proyecto_terreno PRIMARY KEY (id_especificacion_proyecto_terreno),
    CONSTRAINT uk_esp_proy_ter_puerta UNIQUE (id_especificacion_puerta)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 4 — SERVICIOS DE TERRENO
-- ══════════════════════════════════════════════════════════════

CREATE TABLE checklist_de_materiales (
    id_checklist_de_materiales  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    tipo_inicio_tarea           TEXT    NOT NULL,
    tipo_cierre_tarea           TEXT    NOT NULL,
    item                        TEXT    NOT NULL,
    es_marcado                  BOOLEAN NOT NULL,
    marcado                     TEXT,
    es_no_marcado               BOOLEAN NOT NULL,
    no_marcado                  TEXT,
    CONSTRAINT pk_checklist PRIMARY KEY (id_checklist_de_materiales)
);

CREATE TABLE servicio_terreno (
    id_servicio_terreno        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    tipo_servicio              TEXT    NOT NULL,
    fecha_real                 DATE    NOT NULL,
    bloque_horario             TIME    NOT NULL,
    prioridad                  TEXT    NOT NULL,
    fecha_programada           TIME    NOT NULL,
    estado                     TEXT    NOT NULL,
    observaciones              TEXT,
    -- FK blanda hacia inventario.usuario
    id_usuario                 BIGINT  NOT NULL,
    id_checklist_de_materiales BIGINT  NOT NULL,
    CONSTRAINT pk_servicio_terreno PRIMARY KEY (id_servicio_terreno)
);

-- Tabla de relación N:M entre servicio_terreno y herramientas/materiales
-- FK blanda: los materiales/herramientas viven en inventario
CREATE TABLE servicio_terreno_herramientas_materiales (
    id_servicio_terreno_herramientas_materiales  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_servicio_terreno                          BIGINT NOT NULL,
    CONSTRAINT pk_st_herramientas PRIMARY KEY (id_servicio_terreno_herramientas_materiales)
);

CREATE TABLE especificacion_servicio_terreno (
    id_servicio_terreno      BIGINT NOT NULL,
    id_especificacion_puerta BIGINT NOT NULL,
    CONSTRAINT pk_esp_servicio PRIMARY KEY (id_servicio_terreno, id_especificacion_puerta)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 5 — TAREAS
-- ══════════════════════════════════════════════════════════════

CREATE TABLE tarea (
    id_tarea                        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    descripcion                     TEXT      NOT NULL,
    fecha_de_visita                 DATE      NOT NULL,
    fecha_de_termino                DATE      NOT NULL,
    bloque_horario                  TIMESTAMP NOT NULL,
    fecha_de_creacion               DATE      NOT NULL,
    fecha_de_ultima_actualizacion   DATE      NOT NULL,
    fecha_de_inicio                 DATE      NOT NULL,
    fecha_de_inicio_en_terreno      DATE      NOT NULL,
    titulo                          TEXT      NOT NULL,
    horario_limite                  TIMESTAMP NOT NULL,
    instrucciones_de_oficina        TEXT,
    urgencia                        TEXT      NOT NULL,
    estado_de_tarea                 TEXT      NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario                      BIGINT    NOT NULL,
    id_servicio_terreno             BIGINT    NOT NULL,
    id_especificacion_puerta        BIGINT    NOT NULL,
    CONSTRAINT pk_tarea PRIMARY KEY (id_tarea)
);

CREATE TABLE tarea_tipo (
    id_tarea_tipo          BIGINT    GENERATED ALWAYS AS IDENTITY NOT NULL,
    tiempo_estimado_tarea  TIMESTAMP NOT NULL,
    remuneracion_tarea     INTEGER   NOT NULL,
    id_tarea               BIGINT    NOT NULL,
    CONSTRAINT pk_tarea_tipo PRIMARY KEY (id_tarea_tipo)
);

CREATE TABLE tarea_usuario (
    id_tarea   BIGINT NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario BIGINT NOT NULL,
    CONSTRAINT pk_tarea_usuario PRIMARY KEY (id_tarea, id_usuario)
);

CREATE TABLE receptor (
    id_receptor           BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    primer_nombre_receptor TEXT   NOT NULL,
    segundo_nombre_receptor TEXT,
    primer_apellido_receptor TEXT  NOT NULL,
    segundo_apellido_receptor TEXT,
    rut_receptor          TEXT   NOT NULL,
    id_tarea              BIGINT NOT NULL,
    CONSTRAINT pk_receptor PRIMARY KEY (id_receptor)
);

CREATE TABLE formulario_de_cierre (
    id_formulario_de_cierre         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    detalle_de_observaciones        TEXT,
    sentido_de_apertura_correcto    BOOLEAN NOT NULL,
    pilastras_incluidas_y_ajustadas BOOLEAN NOT NULL,
    resultado_finalizado            TEXT    NOT NULL,
    cilindro_correcto               BOOLEAN NOT NULL,
    ausencia_de_rayones_o_danos     BOOLEAN NOT NULL,
    id_tarea                        BIGINT  NOT NULL,
    CONSTRAINT pk_formulario_cierre PRIMARY KEY (id_formulario_de_cierre),
    CONSTRAINT uk_formulario_tarea UNIQUE (id_tarea)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 6 — PRÉSTAMOS Y NOTIFICACIONES
-- ══════════════════════════════════════════════════════════════

-- FK blanda: rut_empleado → finanzas.empleado, sku_material → inventario.material
CREATE TABLE prestamo_herramientas (
    id_prestamo_herramienta  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    fecha_entrega            TIMESTAMPTZ NOT NULL,
    fecha_devolucion         TIMESTAMPTZ NOT NULL,
    cantidad                 INTEGER     NOT NULL,
    estado_de_prestamo       TEXT        NOT NULL,
    observacion              TEXT,
    -- FK blanda hacia finanzas.empleado
    rut_empleado             VARCHAR(12) NOT NULL,
    -- FK blanda hacia inventario.material
    sku_material             BIGINT      NOT NULL,
    CONSTRAINT pk_prestamo_herramientas PRIMARY KEY (id_prestamo_herramienta)
);

CREATE TABLE notificacion_tecnico (
    id_notificacion_tecnico  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    fecha_emision            TIMESTAMPTZ NOT NULL,
    mensaje                  TEXT        NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario               BIGINT      NOT NULL,
    id_servicio_terreno      BIGINT      NOT NULL,
    CONSTRAINT pk_notificacion_tecnico PRIMARY KEY (id_notificacion_tecnico)
);

CREATE TABLE notificacion_terreno (
    id_notificacion_terreno  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    mensaje                  TEXT   NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario               BIGINT NOT NULL,
    id_tarea                 BIGINT NOT NULL,
    CONSTRAINT pk_notificacion_terreno PRIMARY KEY (id_notificacion_terreno)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 7 — FOREIGN KEYS INTERNAS
-- ══════════════════════════════════════════════════════════════

-- medidas_puerta no tiene FKs internas

ALTER TABLE especificacion_puerta
    ADD CONSTRAINT fk_ep_medidas FOREIGN KEY (id_medidas) REFERENCES medidas_puerta(id_medidas);

ALTER TABLE hoja_simple
    ADD CONSTRAINT fk_hs_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE hoja_doble
    ADD CONSTRAINT fk_hd_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE especificacion_metalmecanica
    ADD CONSTRAINT fk_em_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE especificacion_terminaciones
    ADD CONSTRAINT fk_et_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE detalles_herraje
    ADD CONSTRAINT fk_dh_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);
    -- sku_material: FK blanda hacia inventario.material

ALTER TABLE adicionales_pagados
    ADD CONSTRAINT fk_ap_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE historial_cambio_orden_trabajo
    ADD CONSTRAINT fk_hcot_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE proyecto
    ADD CONSTRAINT fk_proy_cliente FOREIGN KEY (rut_cliente) REFERENCES cliente(rut_cliente);

ALTER TABLE obra
    ADD CONSTRAINT fk_obra_cliente FOREIGN KEY (rut_cliente) REFERENCES cliente(rut_cliente),
    ADD CONSTRAINT fk_obra_ep      FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE especificacion_proyecto_terreno
    ADD CONSTRAINT fk_ept_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE servicio_terreno
    ADD CONSTRAINT fk_st_checklist FOREIGN KEY (id_checklist_de_materiales) REFERENCES checklist_de_materiales(id_checklist_de_materiales);
    -- id_usuario: FK blanda hacia inventario.usuario

ALTER TABLE servicio_terreno_herramientas_materiales
    ADD CONSTRAINT fk_sthm_st FOREIGN KEY (id_servicio_terreno) REFERENCES servicio_terreno(id_servicio_terreno);

ALTER TABLE especificacion_servicio_terreno
    ADD CONSTRAINT fk_est_st FOREIGN KEY (id_servicio_terreno) REFERENCES servicio_terreno(id_servicio_terreno),
    ADD CONSTRAINT fk_est_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);

ALTER TABLE tarea
    ADD CONSTRAINT fk_t_st FOREIGN KEY (id_servicio_terreno) REFERENCES servicio_terreno(id_servicio_terreno),
    ADD CONSTRAINT fk_t_ep FOREIGN KEY (id_especificacion_puerta) REFERENCES especificacion_puerta(id_especificacion_puerta);
    -- id_usuario: FK blanda hacia inventario.usuario

ALTER TABLE tarea_tipo
    ADD CONSTRAINT fk_tt_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea);

ALTER TABLE tarea_usuario
    ADD CONSTRAINT fk_tu_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea);
    -- id_usuario: FK blanda hacia inventario.usuario

ALTER TABLE receptor
    ADD CONSTRAINT fk_rec_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea);

ALTER TABLE formulario_de_cierre
    ADD CONSTRAINT fk_fc_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea);

ALTER TABLE notificacion_tecnico
    ADD CONSTRAINT fk_nt_st FOREIGN KEY (id_servicio_terreno) REFERENCES servicio_terreno(id_servicio_terreno);
    -- id_usuario: FK blanda hacia inventario.usuario

ALTER TABLE notificacion_terreno
    ADD CONSTRAINT fk_nter_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea);
    -- id_usuario: FK blanda hacia inventario.usuario

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 8 — ÍNDICES
-- ══════════════════════════════════════════════════════════════

CREATE INDEX idx_ep_modelo      ON especificacion_puerta(modelo_puerta);
CREATE INDEX idx_ep_medidas     ON especificacion_puerta(id_medidas);

CREATE INDEX idx_proy_cliente   ON proyecto(rut_cliente);
CREATE INDEX idx_proy_estado    ON proyecto(estado_operacional);

CREATE INDEX idx_obra_cliente   ON obra(rut_cliente);
CREATE INDEX idx_obra_ep        ON obra(id_especificacion_puerta);

CREATE INDEX idx_st_usuario     ON servicio_terreno(id_usuario);
CREATE INDEX idx_st_estado      ON servicio_terreno(estado);

CREATE INDEX idx_tarea_st       ON tarea(id_servicio_terreno);
CREATE INDEX idx_tarea_ep       ON tarea(id_especificacion_puerta);
CREATE INDEX idx_tarea_usuario  ON tarea(id_usuario);
CREATE INDEX idx_tarea_estado   ON tarea(estado_de_tarea);

CREATE INDEX idx_nt_st          ON notificacion_tecnico(id_servicio_terreno);
CREATE INDEX idx_nter_tarea     ON notificacion_terreno(id_tarea);

CREATE INDEX idx_prestamo_emp   ON prestamo_herramientas(rut_empleado);
CREATE INDEX idx_prestamo_mat   ON prestamo_herramientas(sku_material);

CREATE INDEX idx_receptor_tarea ON receptor(id_tarea);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 9 — COMENTARIOS
-- ══════════════════════════════════════════════════════════════

COMMENT ON SCHEMA terreno IS 'Módulo Terreno — Sistema Puertas Blindadas';
COMMENT ON TABLE cliente IS 'Dueño: terreno. Finanzas referencia rut_cliente como FK blanda.';
COMMENT ON TABLE especificacion_puerta IS 'Entidad central del módulo. Nombre alineado con convención snake_case.';
COMMENT ON TABLE servicio_terreno_herramientas_materiales IS 'Relación N:M con herramientas/materiales de inventario. Nombre corregido (sin doble "t").';
COMMENT ON TABLE notificacion_terreno IS 'Tabla propia del grupo Terreno, no presente en el conjunto original. Aprobada como extensión.';

COMMENT ON COLUMN servicio_terreno.id_usuario IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN tarea.id_usuario IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN tarea_usuario.id_usuario IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN notificacion_tecnico.id_usuario IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN notificacion_terreno.id_usuario IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN detalles_herraje.sku_material IS 'FK blanda hacia inventario.material — sin constraint cross-schema';
COMMENT ON COLUMN prestamo_herramientas.rut_empleado IS 'FK blanda hacia finanzas.empleado — sin constraint cross-schema';
COMMENT ON COLUMN prestamo_herramientas.sku_material IS 'FK blanda hacia inventario.material — sin constraint cross-schema';

COMMIT;

-- ============================================================
-- Sistema Puertas Blindadas — Módulo Finanzas
-- SQL CORREGIDO v2
-- Schema: finanzas
--
-- CAMBIOS v2:
-- - ELIMINADA: proveedor (pasa a inventario, se referencia como FK blanda)
-- - INCORPORADAS: empleado, empleado_cargo, empleado_tipo_vinculo_laboral
--   → Finanzas es el dueño de estas tablas por decisión de arquitectura.
--   → Inventario y Terreno las referencian con FK blanda.
-- - APLICADO: parche de id_cliente_financiero como PK surrogada
--   (reemplaza rut_cliente como PK en cliente_financiero y ficha_cliente)
-- - CORREGIDO: typo proveedor_doc_indentidad → proveedor_doc_identidad
--   (en referencias de documento_compra_proveedor solo queda id_proveedor como FK blanda)
-- ============================================================

BEGIN;

DROP SCHEMA IF EXISTS finanzas CASCADE;
CREATE SCHEMA finanzas;
SET search_path TO finanzas;

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 1 — TABLAS DE EMPLEADO (dueño: finanzas)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE empleado_cargo (
    empleado_cargo_id_cargo    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    empleado_cargo_nombre      VARCHAR(150) NOT NULL,
    empleado_cargo_sueldo_base NUMERIC(14,2),
    CONSTRAINT pk_empleado_cargo PRIMARY KEY (empleado_cargo_id_cargo),
    CONSTRAINT ck_emp_cargo_sueldo CHECK (empleado_cargo_sueldo_base >= 0)
);

CREATE TABLE empleado_tipo_vinculo_laboral (
    empleado_tipo_vinculo_laboral_id_tipo_vinculo  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    empleado_tipo_vinculo_laboral_nombre           VARCHAR(150) NOT NULL,
    empleado_tipo_vinculo_laboral_seguro_cesantia  BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_empleado_tipo_vinculo PRIMARY KEY (empleado_tipo_vinculo_laboral_id_tipo_vinculo)
);

CREATE TABLE empleado (
    empleado_rut_empleado                              VARCHAR(12)  NOT NULL,
    empleado_nombre_empleado_primer_nombre_empleado    VARCHAR(100) NOT NULL,
    empleado_nombre_empleado_segundo_nombre_empleado   VARCHAR(100),
    empleado_nombre_empleado_primer_apellido_empleado  VARCHAR(100) NOT NULL,
    empleado_nombre_empleado_segundo_apellido_empleado VARCHAR(100),
    empleado_estado                                    VARCHAR(50)  NOT NULL,
    empleado_fecha_ingreso                             DATE,
    empleado_afp                                       VARCHAR(100),
    empleado_prevision_salud                           VARCHAR(100),
    empleado_fecha_nacimiento                          DATE,
    empleado_cargo_id_cargo                            BIGINT       NOT NULL,
    empleado_tipo_vinculo_laboral_id_tipo_vinculo      BIGINT       NOT NULL,
    CONSTRAINT pk_empleado PRIMARY KEY (empleado_rut_empleado)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 2 — CLIENTE FINANCIERO
-- ══════════════════════════════════════════════════════════════

CREATE TABLE tipo_cliente (
    id_tipo_cliente      BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_tipo_cliente  VARCHAR(80) NOT NULL,
    descripcion          TEXT,
    activo               BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tipo_cliente PRIMARY KEY (id_tipo_cliente),
    CONSTRAINT uk_tipo_cliente_nombre UNIQUE (nombre_tipo_cliente)
);

-- PK surrogada id_cliente_financiero (parche aplicado)
-- rut_cliente se mantiene como columna con UNIQUE para búsquedas
CREATE TABLE cliente_financiero (
    id_cliente_financiero    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    rut_cliente              VARCHAR(12)  NOT NULL,
    id_tipo_cliente          BIGINT       NOT NULL,
    nombre_razon_social      VARCHAR(150) NOT NULL,
    telefono_principal       VARCHAR(30),
    correo_principal         VARCHAR(120),
    estado_cliente           VARCHAR(30)  NOT NULL DEFAULT 'activo',
    fecha_creacion           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    fecha_actualizacion_datos TIMESTAMPTZ,
    CONSTRAINT pk_cliente_financiero PRIMARY KEY (id_cliente_financiero),
    CONSTRAINT uk_cliente_financiero_rut UNIQUE (rut_cliente)
    -- rut_cliente es FK blanda hacia terreno.cliente (sin constraint cross-schema)
);

CREATE TABLE ficha_cliente (
    id_cliente_financiero  BIGINT      NOT NULL,
    fecha_creacion         TIMESTAMPTZ NOT NULL DEFAULT now(),
    observaciones          TEXT,
    estado_revision        VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    CONSTRAINT pk_ficha_cliente PRIMARY KEY (id_cliente_financiero)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 3 — PROYECTO FINANCIERO Y COMERCIAL
-- ══════════════════════════════════════════════════════════════

CREATE TABLE proyecto_financiero (
    id_proyecto_financiero BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_cliente_financiero  BIGINT       NOT NULL,
    -- FK blandas hacia terreno
    id_obra                BIGINT,
    id_proyecto_terreno    BIGINT,
    codigo_proyecto        VARCHAR(50)  NOT NULL,
    nombre_referencia      VARCHAR(150),
    fecha_ingreso          DATE         NOT NULL,
    estado_financiero      VARCHAR(30)  NOT NULL DEFAULT 'activo',
    observacion            TEXT,
    CONSTRAINT pk_proyecto_financiero PRIMARY KEY (id_proyecto_financiero),
    CONSTRAINT uk_proyecto_financiero_codigo UNIQUE (codigo_proyecto)
);

CREATE TABLE cotizacion (
    id_cotizacion          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    numero_cotizacion      VARCHAR(50)  NOT NULL,
    id_cliente_financiero  BIGINT       NOT NULL,
    id_proyecto_financiero BIGINT,
    -- FK blanda hacia inventario.usuario
    id_usuario_creador     BIGINT       NOT NULL,
    fecha_emision          DATE         NOT NULL,
    fecha_vigencia         DATE,
    moneda                 VARCHAR(10)  NOT NULL DEFAULT 'CLP',
    tipo_cambio            NUMERIC(14,4),
    margen_pct             NUMERIC(5,2),
    estado                 VARCHAR(30)  NOT NULL DEFAULT 'emitida',
    observacion            TEXT,
    CONSTRAINT pk_cotizacion PRIMARY KEY (id_cotizacion),
    CONSTRAINT uk_cotizacion_numero UNIQUE (numero_cotizacion)
);

CREATE TABLE detalle_cotizacion (
    id_detalle_cotizacion       BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_cotizacion               BIGINT        NOT NULL,
    -- FK blanda hacia inventario.material
    sku_material                VARCHAR(16),
    -- FK blanda hacia inventario.lote_fecha_pedido
    id_precio_material          BIGINT,
    descripcion_item            TEXT          NOT NULL,
    cantidad                    NUMERIC(12,2) NOT NULL,
    alto                        NUMERIC(10,2),
    ancho                       NUMERIC(10,2),
    espesor                     NUMERIC(10,2),
    costo_unitario_estimado     NUMERIC(14,2),
    precio_unitario_sugerido    NUMERIC(14,2),
    descuento                   NUMERIC(14,2) DEFAULT 0,
    observacion                 TEXT,
    CONSTRAINT pk_detalle_cotizacion PRIMARY KEY (id_detalle_cotizacion)
);

CREATE TABLE nota_venta (
    id_nota_venta          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    numero_nota_venta      VARCHAR(50)  NOT NULL,
    id_cliente_financiero  BIGINT       NOT NULL,
    id_proyecto_financiero BIGINT,
    id_cotizacion_origen   BIGINT,
    fecha_emision          DATE         NOT NULL,
    fecha_max_entrega      DATE,
    tipo_nota_venta        VARCHAR(50),
    moneda                 VARCHAR(10)  NOT NULL DEFAULT 'CLP',
    tipo_cambio            NUMERIC(14,4),
    descuento              NUMERIC(14,2) DEFAULT 0,
    estado_pedido          VARCHAR(30)  NOT NULL DEFAULT 'pendiente',
    estado_pago            VARCHAR(30)  NOT NULL DEFAULT 'pendiente',
    observacion            TEXT,
    CONSTRAINT pk_nota_venta PRIMARY KEY (id_nota_venta),
    CONSTRAINT uk_nota_venta_numero UNIQUE (numero_nota_venta)
);

CREATE TABLE item_nota_venta (
    id_item_nota_venta     BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_nota_venta          BIGINT        NOT NULL,
    -- FK blanda hacia inventario.producto_terminado
    id_producto_terminado  BIGINT,
    descripcion_item       TEXT          NOT NULL,
    cantidad               NUMERIC(12,2) NOT NULL,
    alto                   NUMERIC(10,2),
    ancho                  NUMERIC(10,2),
    espesor                NUMERIC(10,2),
    precio_unitario        NUMERIC(14,2) NOT NULL,
    descuento              NUMERIC(14,2) DEFAULT 0,
    requiere_produccion    BOOLEAN       NOT NULL DEFAULT FALSE,
    requiere_instalacion   BOOLEAN       NOT NULL DEFAULT FALSE,
    estado_item            VARCHAR(30)   NOT NULL DEFAULT 'pendiente',
    observacion            TEXT,
    CONSTRAINT pk_item_nota_venta PRIMARY KEY (id_item_nota_venta)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 4 — DOCUMENTOS TRIBUTARIOS Y COBROS
-- ══════════════════════════════════════════════════════════════

CREATE TABLE tipo_documento_tributario (
    id_tipo_documento_tributario  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_tipo_documento         VARCHAR(80) NOT NULL,
    descripcion                   TEXT,
    afecta_iva                    BOOLEAN     NOT NULL DEFAULT TRUE,
    activo                        BOOLEAN     NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tipo_documento_tributario PRIMARY KEY (id_tipo_documento_tributario),
    CONSTRAINT uk_tipo_doc_trib_nombre UNIQUE (nombre_tipo_documento)
);

CREATE TABLE documento_tributario (
    id_documento_tributario       BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_tipo_documento_tributario  BIGINT      NOT NULL,
    numero_documento              VARCHAR(50) NOT NULL,
    id_nota_venta                 BIGINT      NOT NULL,
    fecha_emision                 DATE        NOT NULL,
    fecha_vencimiento             DATE,
    monto_neto                    NUMERIC(14,2) NOT NULL,
    tasa_iva_aplicada             NUMERIC(5,2),
    es_exento                     BOOLEAN     NOT NULL DEFAULT FALSE,
    estado_documento              VARCHAR(30) NOT NULL DEFAULT 'emitido',
    archivo_url                   TEXT,
    CONSTRAINT pk_documento_tributario PRIMARY KEY (id_documento_tributario),
    CONSTRAINT uk_doc_trib_tipo_numero UNIQUE (id_tipo_documento_tributario, numero_documento)
);

CREATE TABLE hito_cobro (
    id_hito_cobro          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_proyecto_financiero BIGINT        NOT NULL,
    tipo_hito              VARCHAR(80)   NOT NULL,
    descripcion            TEXT,
    porcentaje_estimado    NUMERIC(5,2),
    monto_estimado         NUMERIC(14,2),
    fecha_comprometida     DATE,
    condicion_cobro        TEXT,
    condicion_liberacion   TEXT,
    estado_hito            VARCHAR(30)   NOT NULL DEFAULT 'pendiente',
    orden_hito             INTEGER       NOT NULL,
    CONSTRAINT pk_hito_cobro PRIMARY KEY (id_hito_cobro),
    CONSTRAINT uk_hito_cobro_proyecto_orden UNIQUE (id_proyecto_financiero, orden_hito)
);

CREATE TABLE medio_pago (
    id_medio_pago    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_medio_pago VARCHAR(80) NOT NULL,
    descripcion      TEXT,
    activo           BOOLEAN     NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_medio_pago PRIMARY KEY (id_medio_pago),
    CONSTRAINT uk_medio_pago_nombre UNIQUE (nombre_medio_pago)
);

CREATE TABLE pago_cliente (
    id_pago_cliente        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_cliente_financiero  BIGINT        NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_registra    BIGINT        NOT NULL,
    id_medio_pago          BIGINT        NOT NULL,
    fecha_pago             DATE          NOT NULL,
    monto_pago             NUMERIC(14,2) NOT NULL,
    tipo_pago              VARCHAR(50),
    requiere_fecha_cobro   BOOLEAN       NOT NULL DEFAULT FALSE,
    nro_cuotas             INTEGER,
    fecha_cobro            DATE,
    comprobante_url        TEXT,
    estado_pago            VARCHAR(30)   NOT NULL DEFAULT 'registrado',
    observacion            TEXT,
    CONSTRAINT pk_pago_cliente PRIMARY KEY (id_pago_cliente)
);

CREATE TABLE asignacion_pago_cliente (
    id_asignacion_pago_cliente  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_pago_cliente             BIGINT        NOT NULL,
    id_proyecto_financiero      BIGINT,
    id_nota_venta               BIGINT,
    id_documento_tributario     BIGINT,
    id_hito_cobro               BIGINT,
    monto_asignado              NUMERIC(14,2) NOT NULL,
    observacion                 TEXT,
    CONSTRAINT pk_asignacion_pago_cliente PRIMARY KEY (id_asignacion_pago_cliente)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 5 — DOCUMENTOS COMPRA PROVEEDOR Y PAGOS
-- ══════════════════════════════════════════════════════════════

CREATE TABLE tipo_documento_compra_proveedor (
    id_tipo_documento_compra      BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_tipo_documento_compra  VARCHAR(100) NOT NULL,
    descripcion                   TEXT,
    es_preliminar                 BOOLEAN      NOT NULL DEFAULT FALSE,
    genera_obligacion_pago        BOOLEAN      NOT NULL DEFAULT TRUE,
    activo                        BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tipo_documento_compra PRIMARY KEY (id_tipo_documento_compra),
    CONSTRAINT uk_tipo_doc_compra_nombre UNIQUE (nombre_tipo_documento_compra)
);

CREATE TABLE categoria_gasto (
    id_categoria_gasto    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_categoria_gasto VARCHAR(100) NOT NULL,
    descripcion           TEXT,
    activo                BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_categoria_gasto PRIMARY KEY (id_categoria_gasto),
    CONSTRAINT uk_categoria_gasto_nombre UNIQUE (nombre_categoria_gasto)
);

CREATE TABLE documento_compra_proveedor (
    id_documento_compra_proveedor  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    -- FK blanda hacia inventario.proveedor
    id_proveedor                   BIGINT        NOT NULL,
    id_tipo_documento_compra       BIGINT        NOT NULL,
    id_categoria_gasto             BIGINT        NOT NULL,
    numero_documento               VARCHAR(80)   NOT NULL,
    fecha_emision                  DATE          NOT NULL,
    fecha_vencimiento              DATE,
    moneda                         VARCHAR(10)   NOT NULL DEFAULT 'CLP',
    tipo_cambio                    NUMERIC(14,4),
    monto_neto                     NUMERIC(14,2) NOT NULL,
    tasa_iva_aplicada              NUMERIC(5,2),
    tasa_retencion_aplicada        NUMERIC(5,2),
    estado_documento               VARCHAR(30)   NOT NULL DEFAULT 'registrado',
    archivo_url                    TEXT,
    observacion                    TEXT,
    CONSTRAINT pk_documento_compra_proveedor PRIMARY KEY (id_documento_compra_proveedor),
    CONSTRAINT uk_doc_compra_prov UNIQUE (id_proveedor, id_tipo_documento_compra, numero_documento)
);

CREATE TABLE pago_proveedor (
    id_pago_proveedor   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    -- FK blanda hacia inventario.proveedor
    id_proveedor        BIGINT        NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_registra BIGINT        NOT NULL,
    id_medio_pago       BIGINT        NOT NULL,
    fecha_pago          DATE          NOT NULL,
    monto_pago          NUMERIC(14,2) NOT NULL,
    comprobante_url     TEXT,
    estado_pago         VARCHAR(30)   NOT NULL DEFAULT 'registrado',
    observacion         TEXT,
    CONSTRAINT pk_pago_proveedor PRIMARY KEY (id_pago_proveedor)
);

CREATE TABLE asignacion_pago_proveedor (
    id_asignacion_pago_proveedor   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_pago_proveedor              BIGINT        NOT NULL,
    id_documento_compra_proveedor  BIGINT        NOT NULL,
    monto_asignado                 NUMERIC(14,2) NOT NULL,
    observacion                    TEXT,
    CONSTRAINT pk_asignacion_pago_proveedor PRIMARY KEY (id_asignacion_pago_proveedor)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 6 — GASTOS, MOVIMIENTOS Y CONCILIACIÓN
-- ══════════════════════════════════════════════════════════════

CREATE TABLE gasto_caja_chica (
    id_gasto_caja       BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    -- FK blandas hacia inventario.usuario
    id_usuario_registra BIGINT        NOT NULL,
    id_usuario_valida   BIGINT,
    id_categoria_gasto  BIGINT        NOT NULL,
    fecha_gasto         DATE          NOT NULL,
    descripcion         TEXT          NOT NULL,
    monto               NUMERIC(14,2) NOT NULL,
    respaldo_url        TEXT,
    rendido             BOOLEAN       NOT NULL DEFAULT FALSE,
    estado_validacion   VARCHAR(30)   NOT NULL DEFAULT 'pendiente',
    CONSTRAINT pk_gasto_caja_chica PRIMARY KEY (id_gasto_caja)
);

CREATE TABLE costo_proyecto (
    id_costo_proyecto             BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_proyecto_financiero        BIGINT        NOT NULL,
    id_documento_compra_proveedor BIGINT,
    id_gasto_caja                 BIGINT,
    id_tarea_remunerable          BIGINT,
    -- FK blandas hacia inventario
    id_movimiento_inventario      BIGINT,
    id_lote                       BIGINT,
    id_categoria_gasto            BIGINT        NOT NULL,
    monto_asignado                NUMERIC(14,2) NOT NULL,
    fecha_costo                   DATE          NOT NULL,
    descripcion                   TEXT,
    observacion                   TEXT,
    CONSTRAINT pk_costo_proyecto PRIMARY KEY (id_costo_proyecto)
);

CREATE TABLE movimiento_financiero (
    id_movimiento_financiero  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_pago_cliente           BIGINT,
    id_pago_proveedor         BIGINT,
    id_gasto_caja             BIGINT,
    id_liquidacion            BIGINT,
    -- FK blanda hacia inventario.usuario
    id_usuario_registra       BIGINT        NOT NULL,
    fecha_movimiento          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    naturaleza                VARCHAR(20)   NOT NULL,
    monto                     NUMERIC(14,2) NOT NULL,
    estado_conciliacion       VARCHAR(30)   NOT NULL DEFAULT 'pendiente',
    observacion               TEXT,
    CONSTRAINT pk_movimiento_financiero PRIMARY KEY (id_movimiento_financiero)
);

CREATE TABLE movimiento_bancario (
    id_movimiento_bancario  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    fecha_banco             DATE          NOT NULL,
    banco                   VARCHAR(100)  NOT NULL,
    cuenta                  VARCHAR(80),
    glosa                   TEXT,
    monto                   NUMERIC(14,2) NOT NULL,
    cargo_abono             VARCHAR(20)   NOT NULL,
    numero_operacion        VARCHAR(100),
    archivo_origen          TEXT,
    CONSTRAINT pk_movimiento_bancario PRIMARY KEY (id_movimiento_bancario)
);

CREATE TABLE conciliacion (
    id_conciliacion        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_responsable BIGINT      NOT NULL,
    fecha_conciliacion     TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado_conciliacion    VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    observacion            TEXT,
    CONSTRAINT pk_conciliacion PRIMARY KEY (id_conciliacion)
);

CREATE TABLE detalle_conciliacion (
    id_detalle_conciliacion  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_conciliacion          BIGINT        NOT NULL,
    id_movimiento_financiero BIGINT        NOT NULL,
    id_movimiento_bancario   BIGINT        NOT NULL,
    monto_conciliado         NUMERIC(14,2) NOT NULL,
    observacion              TEXT,
    CONSTRAINT pk_detalle_conciliacion PRIMARY KEY (id_detalle_conciliacion)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 7 — CRÉDITO Y EVALUACIÓN
-- ══════════════════════════════════════════════════════════════

CREATE TABLE fondo_global_credito (
    id_fondo_credito                        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    fecha_calculo                           DATE          NOT NULL,
    utilidad_neta_disponible                NUMERIC(14,2) NOT NULL,
    monto_gastos_operacionales_considerados NUMERIC(14,2) NOT NULL DEFAULT 0,
    reserva_emergencia                      NUMERIC(14,2) NOT NULL DEFAULT 0,
    monto_total_calculado                   NUMERIC(14,2) NOT NULL,
    monto_bloqueado                         NUMERIC(14,2) NOT NULL DEFAULT 0,
    monto_disponible                        NUMERIC(14,2) NOT NULL,
    limite_seguridad_pct                    NUMERIC(5,2),
    estado                                  VARCHAR(30)   NOT NULL DEFAULT 'vigente',
    CONSTRAINT pk_fondo_global_credito PRIMARY KEY (id_fondo_credito)
);

CREATE TABLE limite_credito_cliente (
    id_limite_credito_cliente  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_cliente_financiero      BIGINT        NOT NULL,
    monto_limite               NUMERIC(14,2) NOT NULL,
    plazo_dias                 INTEGER       NOT NULL,
    fecha_inicio_vigencia      DATE          NOT NULL,
    fecha_fin_vigencia         DATE,
    estado                     VARCHAR(30)   NOT NULL DEFAULT 'vigente',
    observacion                TEXT,
    CONSTRAINT pk_limite_credito_cliente PRIMARY KEY (id_limite_credito_cliente)
);

CREATE TABLE parametro_riesgo_financiero (
    id_parametro_riesgo    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_parametro       VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    tipo_parametro         VARCHAR(50),
    peso                   NUMERIC(5,2) NOT NULL DEFAULT 0,
    puntaje_maximo         NUMERIC(5,2),
    valor_referencia       VARCHAR(100),
    operador_evaluacion    VARCHAR(20),
    activo                 BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_parametro_riesgo PRIMARY KEY (id_parametro_riesgo),
    CONSTRAINT uk_parametro_riesgo_nombre UNIQUE (nombre_parametro)
);

CREATE TABLE evaluacion_credito (
    id_evaluacion_credito  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_cliente_financiero  BIGINT      NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_autorizador BIGINT      NOT NULL,
    fecha_evaluacion       TIMESTAMPTZ NOT NULL DEFAULT now(),
    score_confianza        NUMERIC(5,2),
    resultado              VARCHAR(30) NOT NULL,
    causa_rechazo          TEXT,
    aprobacion_excepcional BOOLEAN     NOT NULL DEFAULT FALSE,
    observacion            TEXT,
    CONSTRAINT pk_evaluacion_credito PRIMARY KEY (id_evaluacion_credito)
);

CREATE TABLE detalle_evaluacion_credito (
    id_detalle_evaluacion_credito  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_evaluacion_credito          BIGINT       NOT NULL,
    id_parametro_riesgo            BIGINT       NOT NULL,
    valor_obtenido                 VARCHAR(100),
    puntaje_obtenido               NUMERIC(5,2),
    cumple                         BOOLEAN,
    observacion                    TEXT,
    CONSTRAINT pk_detalle_evaluacion_credito PRIMARY KEY (id_detalle_evaluacion_credito),
    CONSTRAINT uk_det_eval_credito UNIQUE (id_evaluacion_credito, id_parametro_riesgo)
);

CREATE TABLE credito_proyecto (
    id_credito_proyecto        BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_proyecto_financiero     BIGINT        NOT NULL,
    id_limite_credito_cliente  BIGINT,
    id_fondo_credito           BIGINT        NOT NULL,
    id_evaluacion_credito      BIGINT        NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_autorizador     BIGINT        NOT NULL,
    monto_credito_aprobado     NUMERIC(14,2) NOT NULL,
    monto_bloqueado            NUMERIC(14,2) NOT NULL DEFAULT 0,
    fecha_aprobacion           DATE          NOT NULL,
    estado_credito             VARCHAR(30)   NOT NULL DEFAULT 'aprobado',
    observacion                TEXT,
    CONSTRAINT pk_credito_proyecto PRIMARY KEY (id_credito_proyecto)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 8 — REMUNERACIONES
-- ══════════════════════════════════════════════════════════════

CREATE TABLE tipo_tarea_catalogada (
    id_tipo_tarea    BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    nombre_tipo_tarea VARCHAR(100) NOT NULL,
    descripcion      TEXT,
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tipo_tarea_catalogada PRIMARY KEY (id_tipo_tarea),
    CONSTRAINT uk_tipo_tarea_nombre UNIQUE (nombre_tipo_tarea)
);

CREATE TABLE tarea_catalogada (
    id_tarea_catalogada  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_tipo_tarea        BIGINT       NOT NULL,
    nombre_tarea         VARCHAR(150) NOT NULL,
    descripcion          TEXT,
    activo               BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tarea_catalogada PRIMARY KEY (id_tarea_catalogada),
    CONSTRAINT uk_tarea_catalogada_nombre UNIQUE (nombre_tarea)
);

CREATE TABLE tarifa_tarea (
    id_tarifa_tarea     BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_tarea_catalogada BIGINT        NOT NULL,
    valor_unitario      NUMERIC(14,2) NOT NULL,
    vigencia_desde      DATE          NOT NULL,
    vigencia_hasta      DATE,
    activo              BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_tarifa_tarea PRIMARY KEY (id_tarifa_tarea)
);

CREATE TABLE tarea_remunerable (
    id_tarea_remunerable   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    rut_empleado           VARCHAR(12)   NOT NULL,
    id_tarea_catalogada    BIGINT        NOT NULL,
    id_tarifa_tarea        BIGINT        NOT NULL,
    id_proyecto_financiero BIGINT,
    -- FK blandas hacia inventario
    id_producto_terminado  BIGINT,
    id_orden_trabajo       BIGINT,
    fecha                  DATE          NOT NULL,
    cantidad               NUMERIC(12,2),
    horas                  NUMERIC(10,2),
    estado_validacion      VARCHAR(30)   NOT NULL DEFAULT 'pendiente',
    observacion            TEXT,
    CONSTRAINT pk_tarea_remunerable PRIMARY KEY (id_tarea_remunerable)
);

CREATE TABLE liquidacion_remuneracion (
    id_liquidacion       BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    rut_empleado         VARCHAR(12) NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario_cierra    BIGINT      NOT NULL,
    periodo_inicio       DATE        NOT NULL,
    periodo_fin          DATE        NOT NULL,
    estado               VARCHAR(30) NOT NULL DEFAULT 'abierta',
    CONSTRAINT pk_liquidacion_remuneracion PRIMARY KEY (id_liquidacion),
    CONSTRAINT uk_liquidacion_emp_periodo UNIQUE (rut_empleado, periodo_inicio, periodo_fin)
);

CREATE TABLE concepto_remuneracion (
    id_concepto_remuneracion  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_liquidacion            BIGINT        NOT NULL,
    id_tarea_remunerable      BIGINT,
    tipo_concepto             VARCHAR(50)   NOT NULL,
    descripcion               TEXT          NOT NULL,
    monto                     NUMERIC(14,2) NOT NULL,
    es_imponible              BOOLEAN       NOT NULL DEFAULT TRUE,
    observacion               TEXT,
    CONSTRAINT pk_concepto_remuneracion PRIMARY KEY (id_concepto_remuneracion)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 9 — AUDITORÍA Y ALERTAS
-- ══════════════════════════════════════════════════════════════

CREATE TABLE evento_auditoria (
    id_evento          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    -- FK blanda hacia inventario.usuario
    id_usuario         BIGINT         NOT NULL,
    fecha_hora         TIMESTAMPTZ    NOT NULL DEFAULT now(),
    accion_realizada   VARCHAR(100)   NOT NULL,
    entidad_afectada   VARCHAR(100)   NOT NULL,
    registro_afectado  VARCHAR(100),
    ip_origen          VARCHAR(45),
    motivo             TEXT,
    observacion        TEXT,
    CONSTRAINT pk_evento_auditoria PRIMARY KEY (id_evento)
);

CREATE TABLE detalle_evento_auditoria (
    id_detalle_evento  BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    id_evento          BIGINT       NOT NULL,
    campo_afectado     VARCHAR(100) NOT NULL,
    valor_anterior     TEXT,
    valor_nuevo        TEXT,
    CONSTRAINT pk_detalle_evento_auditoria PRIMARY KEY (id_detalle_evento)
);

CREATE TABLE alerta_financiera (
    id_alerta_financiera          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    tipo_alerta                   VARCHAR(80)  NOT NULL,
    nivel_alerta                  VARCHAR(30),
    fecha_generacion              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    prioridad                     VARCHAR(30),
    estado                        VARCHAR(30)  NOT NULL DEFAULT 'pendiente',
    mensaje                       TEXT         NOT NULL,
    id_cliente_financiero         BIGINT,
    id_proyecto_financiero        BIGINT,
    id_documento_tributario       BIGINT,
    id_documento_compra_proveedor BIGINT,
    id_costo_proyecto             BIGINT,
    id_credito_proyecto           BIGINT,
    CONSTRAINT pk_alerta_financiera PRIMARY KEY (id_alerta_financiera)
);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 10 — FOREIGN KEYS INTERNAS
-- ══════════════════════════════════════════════════════════════

-- Empleado
ALTER TABLE empleado
    ADD CONSTRAINT fk_emp_cargo   FOREIGN KEY (empleado_cargo_id_cargo) REFERENCES empleado_cargo(empleado_cargo_id_cargo),
    ADD CONSTRAINT fk_emp_vinculo FOREIGN KEY (empleado_tipo_vinculo_laboral_id_tipo_vinculo)
                                  REFERENCES empleado_tipo_vinculo_laboral(empleado_tipo_vinculo_laboral_id_tipo_vinculo);

-- Cliente financiero
ALTER TABLE cliente_financiero
    ADD CONSTRAINT fk_cf_tipo_cliente FOREIGN KEY (id_tipo_cliente) REFERENCES tipo_cliente(id_tipo_cliente);
    -- rut_cliente: FK blanda hacia terreno.cliente (sin constraint)

ALTER TABLE ficha_cliente
    ADD CONSTRAINT fk_fc_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero);

-- Proyecto financiero
ALTER TABLE proyecto_financiero
    ADD CONSTRAINT fk_pf_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero);
    -- id_obra, id_proyecto_terreno: FK blandas hacia terreno

-- Cotización
ALTER TABLE cotizacion
    ADD CONSTRAINT fk_cot_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero),
    ADD CONSTRAINT fk_cot_proyecto_financiero FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero);
    -- id_usuario_creador: FK blanda hacia inventario.usuario

-- Detalle cotización
ALTER TABLE detalle_cotizacion
    ADD CONSTRAINT fk_det_cot_cotizacion FOREIGN KEY (id_cotizacion) REFERENCES cotizacion(id_cotizacion);
    -- sku_material: FK blanda hacia inventario.material
    -- id_precio_material: FK blanda hacia inventario.lote_fecha_pedido

-- Nota de venta
ALTER TABLE nota_venta
    ADD CONSTRAINT fk_nv_cliente_financiero  FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero),
    ADD CONSTRAINT fk_nv_proyecto_financiero FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero),
    ADD CONSTRAINT fk_nv_cotizacion_origen   FOREIGN KEY (id_cotizacion_origen) REFERENCES cotizacion(id_cotizacion);

-- Item nota venta
ALTER TABLE item_nota_venta
    ADD CONSTRAINT fk_inv_nota_venta FOREIGN KEY (id_nota_venta) REFERENCES nota_venta(id_nota_venta);
    -- id_producto_terminado: FK blanda hacia inventario.producto_terminado

-- Documento tributario
ALTER TABLE documento_tributario
    ADD CONSTRAINT fk_dt_tipo FOREIGN KEY (id_tipo_documento_tributario) REFERENCES tipo_documento_tributario(id_tipo_documento_tributario),
    ADD CONSTRAINT fk_dt_nota_venta FOREIGN KEY (id_nota_venta) REFERENCES nota_venta(id_nota_venta);

-- Hito cobro
ALTER TABLE hito_cobro
    ADD CONSTRAINT fk_hc_proyecto_financiero FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero);

-- Pago cliente
ALTER TABLE pago_cliente
    ADD CONSTRAINT fk_pc_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero),
    ADD CONSTRAINT fk_pc_medio_pago         FOREIGN KEY (id_medio_pago) REFERENCES medio_pago(id_medio_pago);
    -- id_usuario_registra: FK blanda hacia inventario.usuario

-- Asignación pago cliente
ALTER TABLE asignacion_pago_cliente
    ADD CONSTRAINT fk_apc_pago_cliente    FOREIGN KEY (id_pago_cliente) REFERENCES pago_cliente(id_pago_cliente),
    ADD CONSTRAINT fk_apc_proyecto        FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero),
    ADD CONSTRAINT fk_apc_nota_venta      FOREIGN KEY (id_nota_venta) REFERENCES nota_venta(id_nota_venta),
    ADD CONSTRAINT fk_apc_doc_tributario  FOREIGN KEY (id_documento_tributario) REFERENCES documento_tributario(id_documento_tributario),
    ADD CONSTRAINT fk_apc_hito_cobro      FOREIGN KEY (id_hito_cobro) REFERENCES hito_cobro(id_hito_cobro);

-- Documento compra proveedor
ALTER TABLE documento_compra_proveedor
    ADD CONSTRAINT fk_dcp_tipo_doc  FOREIGN KEY (id_tipo_documento_compra) REFERENCES tipo_documento_compra_proveedor(id_tipo_documento_compra),
    ADD CONSTRAINT fk_dcp_cat_gasto FOREIGN KEY (id_categoria_gasto) REFERENCES categoria_gasto(id_categoria_gasto);
    -- id_proveedor: FK blanda hacia inventario.proveedor

-- Pago proveedor
ALTER TABLE pago_proveedor
    ADD CONSTRAINT fk_pp_medio_pago FOREIGN KEY (id_medio_pago) REFERENCES medio_pago(id_medio_pago);
    -- id_proveedor: FK blanda hacia inventario.proveedor
    -- id_usuario_registra: FK blanda hacia inventario.usuario

-- Asignación pago proveedor
ALTER TABLE asignacion_pago_proveedor
    ADD CONSTRAINT fk_app_pago_proveedor FOREIGN KEY (id_pago_proveedor) REFERENCES pago_proveedor(id_pago_proveedor),
    ADD CONSTRAINT fk_app_doc_compra     FOREIGN KEY (id_documento_compra_proveedor) REFERENCES documento_compra_proveedor(id_documento_compra_proveedor);

-- Gasto caja chica
ALTER TABLE gasto_caja_chica
    ADD CONSTRAINT fk_gcc_cat_gasto FOREIGN KEY (id_categoria_gasto) REFERENCES categoria_gasto(id_categoria_gasto);
    -- id_usuario_registra, id_usuario_valida: FK blandas hacia inventario.usuario

-- Costo proyecto
ALTER TABLE costo_proyecto
    ADD CONSTRAINT fk_cp_proyecto_financiero FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero),
    ADD CONSTRAINT fk_cp_doc_compra          FOREIGN KEY (id_documento_compra_proveedor) REFERENCES documento_compra_proveedor(id_documento_compra_proveedor),
    ADD CONSTRAINT fk_cp_gasto_caja          FOREIGN KEY (id_gasto_caja) REFERENCES gasto_caja_chica(id_gasto_caja),
    ADD CONSTRAINT fk_cp_tarea_remunerable   FOREIGN KEY (id_tarea_remunerable) REFERENCES tarea_remunerable(id_tarea_remunerable),
    ADD CONSTRAINT fk_cp_cat_gasto           FOREIGN KEY (id_categoria_gasto) REFERENCES categoria_gasto(id_categoria_gasto);
    -- id_movimiento_inventario, id_lote: FK blandas hacia inventario

-- Movimiento financiero
ALTER TABLE movimiento_financiero
    ADD CONSTRAINT fk_mf_pago_cliente   FOREIGN KEY (id_pago_cliente) REFERENCES pago_cliente(id_pago_cliente),
    ADD CONSTRAINT fk_mf_pago_proveedor FOREIGN KEY (id_pago_proveedor) REFERENCES pago_proveedor(id_pago_proveedor),
    ADD CONSTRAINT fk_mf_gasto_caja     FOREIGN KEY (id_gasto_caja) REFERENCES gasto_caja_chica(id_gasto_caja),
    ADD CONSTRAINT fk_mf_liquidacion    FOREIGN KEY (id_liquidacion) REFERENCES liquidacion_remuneracion(id_liquidacion);
    -- id_usuario_registra: FK blanda hacia inventario.usuario

-- Detalle conciliación
ALTER TABLE detalle_conciliacion
    ADD CONSTRAINT fk_dc_conciliacion         FOREIGN KEY (id_conciliacion) REFERENCES conciliacion(id_conciliacion),
    ADD CONSTRAINT fk_dc_movimiento_financiero FOREIGN KEY (id_movimiento_financiero) REFERENCES movimiento_financiero(id_movimiento_financiero),
    ADD CONSTRAINT fk_dc_movimiento_bancario   FOREIGN KEY (id_movimiento_bancario) REFERENCES movimiento_bancario(id_movimiento_bancario);

-- Límite crédito cliente
ALTER TABLE limite_credito_cliente
    ADD CONSTRAINT fk_lcc_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero);

-- Evaluación crédito
ALTER TABLE evaluacion_credito
    ADD CONSTRAINT fk_ec_cliente_financiero FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero);
    -- id_usuario_autorizador: FK blanda hacia inventario.usuario

-- Detalle evaluación crédito
ALTER TABLE detalle_evaluacion_credito
    ADD CONSTRAINT fk_dec_evaluacion_credito FOREIGN KEY (id_evaluacion_credito) REFERENCES evaluacion_credito(id_evaluacion_credito),
    ADD CONSTRAINT fk_dec_parametro_riesgo   FOREIGN KEY (id_parametro_riesgo) REFERENCES parametro_riesgo_financiero(id_parametro_riesgo);

-- Crédito proyecto
ALTER TABLE credito_proyecto
    ADD CONSTRAINT fk_crp_proyecto_financiero    FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero),
    ADD CONSTRAINT fk_crp_limite_credito_cliente FOREIGN KEY (id_limite_credito_cliente) REFERENCES limite_credito_cliente(id_limite_credito_cliente),
    ADD CONSTRAINT fk_crp_fondo_credito          FOREIGN KEY (id_fondo_credito) REFERENCES fondo_global_credito(id_fondo_credito),
    ADD CONSTRAINT fk_crp_evaluacion_credito     FOREIGN KEY (id_evaluacion_credito) REFERENCES evaluacion_credito(id_evaluacion_credito);
    -- id_usuario_autorizador: FK blanda hacia inventario.usuario

-- Tarea catalogada
ALTER TABLE tarea_catalogada
    ADD CONSTRAINT fk_tc_tipo_tarea FOREIGN KEY (id_tipo_tarea) REFERENCES tipo_tarea_catalogada(id_tipo_tarea);

-- Tarifa tarea
ALTER TABLE tarifa_tarea
    ADD CONSTRAINT fk_tt_tarea_catalogada FOREIGN KEY (id_tarea_catalogada) REFERENCES tarea_catalogada(id_tarea_catalogada);

-- Tarea remunerable
ALTER TABLE tarea_remunerable
    ADD CONSTRAINT fk_tr_empleado         FOREIGN KEY (rut_empleado) REFERENCES empleado(empleado_rut_empleado),
    ADD CONSTRAINT fk_tr_tarea_catalogada FOREIGN KEY (id_tarea_catalogada) REFERENCES tarea_catalogada(id_tarea_catalogada),
    ADD CONSTRAINT fk_tr_tarifa_tarea     FOREIGN KEY (id_tarifa_tarea) REFERENCES tarifa_tarea(id_tarifa_tarea),
    ADD CONSTRAINT fk_tr_proyecto_fin     FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero);
    -- id_producto_terminado, id_orden_trabajo: FK blandas hacia inventario

-- Liquidación remuneración
ALTER TABLE liquidacion_remuneracion
    ADD CONSTRAINT fk_lr_empleado FOREIGN KEY (rut_empleado) REFERENCES empleado(empleado_rut_empleado);
    -- id_usuario_cierra: FK blanda hacia inventario.usuario

-- Concepto remuneración
ALTER TABLE concepto_remuneracion
    ADD CONSTRAINT fk_cr_liquidacion       FOREIGN KEY (id_liquidacion) REFERENCES liquidacion_remuneracion(id_liquidacion),
    ADD CONSTRAINT fk_cr_tarea_remunerable FOREIGN KEY (id_tarea_remunerable) REFERENCES tarea_remunerable(id_tarea_remunerable);

-- Detalle evento auditoría
ALTER TABLE detalle_evento_auditoria
    ADD CONSTRAINT fk_dea_evento FOREIGN KEY (id_evento) REFERENCES evento_auditoria(id_evento);
    -- id_usuario en evento_auditoria: FK blanda hacia inventario.usuario

-- Alerta financiera
ALTER TABLE alerta_financiera
    ADD CONSTRAINT fk_af_cliente_financiero        FOREIGN KEY (id_cliente_financiero) REFERENCES cliente_financiero(id_cliente_financiero),
    ADD CONSTRAINT fk_af_proyecto_financiero       FOREIGN KEY (id_proyecto_financiero) REFERENCES proyecto_financiero(id_proyecto_financiero),
    ADD CONSTRAINT fk_af_documento_tributario      FOREIGN KEY (id_documento_tributario) REFERENCES documento_tributario(id_documento_tributario),
    ADD CONSTRAINT fk_af_documento_compra          FOREIGN KEY (id_documento_compra_proveedor) REFERENCES documento_compra_proveedor(id_documento_compra_proveedor),
    ADD CONSTRAINT fk_af_costo_proyecto            FOREIGN KEY (id_costo_proyecto) REFERENCES costo_proyecto(id_costo_proyecto),
    ADD CONSTRAINT fk_af_credito_proyecto          FOREIGN KEY (id_credito_proyecto) REFERENCES credito_proyecto(id_credito_proyecto);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 11 — ÍNDICES
-- ══════════════════════════════════════════════════════════════

CREATE INDEX idx_emp_cargo         ON empleado(empleado_cargo_id_cargo);
CREATE INDEX idx_emp_vinculo       ON empleado(empleado_tipo_vinculo_laboral_id_tipo_vinculo);

CREATE INDEX idx_cf_rut            ON cliente_financiero(rut_cliente);
CREATE INDEX idx_cf_tipo           ON cliente_financiero(id_tipo_cliente);
CREATE INDEX idx_cf_estado         ON cliente_financiero(estado_cliente);

CREATE INDEX idx_pf_cliente        ON proyecto_financiero(id_cliente_financiero);
CREATE INDEX idx_pf_estado         ON proyecto_financiero(estado_financiero);

CREATE INDEX idx_cot_cliente       ON cotizacion(id_cliente_financiero);
CREATE INDEX idx_cot_proyecto      ON cotizacion(id_proyecto_financiero);
CREATE INDEX idx_cot_estado        ON cotizacion(estado);

CREATE INDEX idx_nv_cliente        ON nota_venta(id_cliente_financiero);
CREATE INDEX idx_nv_proyecto       ON nota_venta(id_proyecto_financiero);
CREATE INDEX idx_nv_estado_pedido  ON nota_venta(estado_pedido);

CREATE INDEX idx_pc_cliente        ON pago_cliente(id_cliente_financiero);
CREATE INDEX idx_pc_estado         ON pago_cliente(estado_pago);

CREATE INDEX idx_mf_estado         ON movimiento_financiero(estado_conciliacion);
CREATE INDEX idx_mf_fecha          ON movimiento_financiero(fecha_movimiento);

CREATE INDEX idx_ec_cliente        ON evaluacion_credito(id_cliente_financiero);
CREATE INDEX idx_lcc_cliente       ON limite_credito_cliente(id_cliente_financiero);

CREATE INDEX idx_tr_empleado       ON tarea_remunerable(rut_empleado);
CREATE INDEX idx_tr_proyecto       ON tarea_remunerable(id_proyecto_financiero);
CREATE INDEX idx_lr_empleado       ON liquidacion_remuneracion(rut_empleado);
CREATE INDEX idx_lr_periodo        ON liquidacion_remuneracion(periodo_inicio, periodo_fin);

CREATE INDEX idx_af_estado         ON alerta_financiera(estado);
CREATE INDEX idx_af_fecha          ON alerta_financiera(fecha_generacion);
CREATE INDEX idx_af_cliente        ON alerta_financiera(id_cliente_financiero);

CREATE INDEX idx_ea_fecha          ON evento_auditoria(fecha_hora);
CREATE INDEX idx_ea_usuario        ON evento_auditoria(id_usuario);

-- ══════════════════════════════════════════════════════════════
-- BLOQUE 12 — COMENTARIOS
-- ══════════════════════════════════════════════════════════════

COMMENT ON SCHEMA finanzas IS 'Módulo Finanzas — Sistema Puertas Blindadas';
COMMENT ON TABLE empleado IS 'Dueño: finanzas. Inventario y Terreno referencian vía FK blanda.';
COMMENT ON TABLE cliente_financiero IS 'PK surrogada id_cliente_financiero (parche aplicado). rut_cliente es FK blanda hacia terreno.cliente.';
COMMENT ON TABLE ficha_cliente IS 'PK = id_cliente_financiero (1:1 con cliente_financiero).';

COMMENT ON COLUMN cliente_financiero.rut_cliente IS 'FK blanda hacia terreno.cliente — sin constraint cross-schema';
COMMENT ON COLUMN proyecto_financiero.id_obra IS 'FK blanda hacia terreno.obra — sin constraint cross-schema';
COMMENT ON COLUMN proyecto_financiero.id_proyecto_terreno IS 'FK blanda hacia terreno.proyecto — sin constraint cross-schema';
COMMENT ON COLUMN cotizacion.id_usuario_creador IS 'FK blanda hacia inventario.usuario — sin constraint cross-schema';
COMMENT ON COLUMN detalle_cotizacion.sku_material IS 'FK blanda hacia inventario.material — sin constraint cross-schema';
COMMENT ON COLUMN detalle_cotizacion.id_precio_material IS 'FK blanda hacia inventario.lote_fecha_pedido — sin constraint cross-schema';
COMMENT ON COLUMN item_nota_venta.id_producto_terminado IS 'FK blanda hacia inventario.producto_terminado — sin constraint cross-schema';
COMMENT ON COLUMN documento_compra_proveedor.id_proveedor IS 'FK blanda hacia inventario.proveedor — sin constraint cross-schema';
COMMENT ON COLUMN pago_proveedor.id_proveedor IS 'FK blanda hacia inventario.proveedor — sin constraint cross-schema';
COMMENT ON COLUMN tarea_remunerable.id_producto_terminado IS 'FK blanda hacia inventario.producto_terminado — sin constraint cross-schema';
COMMENT ON COLUMN tarea_remunerable.id_orden_trabajo IS 'FK blanda hacia inventario.orden_trabajo — sin constraint cross-schema';
COMMENT ON COLUMN costo_proyecto.id_movimiento_inventario IS 'FK blanda hacia inventario.movimiento_inventario — sin constraint cross-schema';
COMMENT ON COLUMN costo_proyecto.id_lote IS 'FK blanda hacia inventario.lote — sin constraint cross-schema';

COMMIT;
