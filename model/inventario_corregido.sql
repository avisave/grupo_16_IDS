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
