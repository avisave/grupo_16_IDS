import pool from "../db.js";

export async function crearOrdenTrabajo(data) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const rutCliente = await obtenerOCrearCliente(client, data.cliente);
        const idMedidas = await guardarMedidasPuerta(client, data.medidas);
        const idEspecificacion = await guardarEspecificacionPuerta(client, {
            ...data,
            id_medidas: idMedidas,
            rut_cliente: rutCliente
        });

        await guardarTerminaciones(client, idEspecificacion, data.terminaciones);

        if (data.herrajes && data.herrajes.length > 0) {
            await guardarHerrajes(client, idEspecificacion, data.herrajes);
        }

        const idOrdenTrabajo = await guardarOrdenTrabajo(client, {
            especificaciones_puerta_id_especificacion_puerta: idEspecificacion,
            area_trabajo_id_area: data.area_trabajo_id_area,
            usuario_id_usuario: data.usuario_id_usuario,
            estado: data.estado || 'pendiente'
        });

        await client.query('COMMIT');

        return {
            success: true,
            id_orden_trabajo: idOrdenTrabajo,
            id_especificacion_puerta: idEspecificacion,
            rut_cliente: rutCliente
        };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear Orden de Trabajo:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function obtenerOCrearCliente(client, clienteData) {
    const query = `
        INSERT INTO terreno.cliente (rut_cliente, razon_social, contacto_principal, correo, telefono, es_cliente_b2c)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (rut_cliente)
        DO UPDATE SET
            razon_social = EXCLUDED.razon_social,
            contacto_principal = EXCLUDED.contacto_principal
        RETURNING rut_cliente;
    `;

    const result = await client.query(query, [
        clienteData.rut || 'TEMP-' + Date.now(),
        clienteData.razon_social || clienteData.nombre,
        clienteData.contacto_principal || clienteData.nombre,
        clienteData.correo || null,
        clienteData.telefono || null,
        clienteData.es_cliente_b2c ?? true
    ]);

    return result.rows[0].rut_cliente;
}

async function guardarMedidasPuerta(client, medidas) {
    const query = `
        INSERT INTO terreno.medidas_puerta (
            medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor,
            medidas_vano_vertical_ancho, medidas_vano_vertical_alto,
            medidas_vano_vertical_espesor, medidas_vano_horizontal_ancho,
            medidas_vano_horizontal_alto
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_medidas;
    `;

    const result = await client.query(query, [
        medidas.marco_ancho,
        medidas.marco_alto,
        medidas.marco_espesor,
        medidas.vano_vertical_ancho,
        medidas.vano_vertical_alto,
        medidas.vano_vertical_espesor,
        medidas.vano_horizontal_ancho,
        medidas.vano_horizontal_alto
    ]);

    return result.rows[0].id_medidas;
}

async function guardarEspecificacionPuerta(client, data) {
    const query = `
        INSERT INTO terreno.especificacion_puerta (
            modelo_puerta, zona, sentido_apertura, materialidad_vano,
            materialidad_marco_actual, solucion_marco, hoja_pasiva,
            hoja_activa, diseno_puerta, observaciones_de_diseno, id_medidas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id_especificacion_puerta;
    `;

    const result = await client.query(query, [
        data.modelo_puerta,
        data.zona || 'Interior',
        data.sentido_apertura,
        data.materialidad_vano,
        data.materialidad_marco_actual,
        data.solucion_marco,
        data.hoja_pasiva || 'No',
        data.hoja_activa || 'Sí',
        data.diseno_puerta,
        data.observaciones,
        data.id_medidas
    ]);

    return result.rows[0].id_especificacion_puerta;
}

async function guardarTerminaciones(client, idEspecificacion, terminaciones) {
    const query = `
        INSERT INTO terreno.especificacion_terminaciones (
            herrajes, enchape, molduras, bisagras, marco_metalico,
            medida_final, id_especificacion_puerta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id_especificacion_puerta) DO UPDATE SET
            herrajes = EXCLUDED.herrajes,
            enchape = EXCLUDED.enchape,
            molduras = EXCLUDED.molduras,
            bisagras = EXCLUDED.bisagras;
    `;

    await client.query(query, [
        terminaciones.herrajes,
        terminaciones.enchape,
        terminaciones.molduras,
        terminaciones.bisagras,
        terminaciones.marco_metalico ?? true,
        terminaciones.medida_final,
        idEspecificacion
    ]);
}

async function guardarHerrajes(client, idEspecificacion, herrajes) {
    for (const herraje of herrajes) {
        await client.query(`
            INSERT INTO terreno.detalles_herraje (
                ubicacion, color, cantidad, observacion, id_especificacion_puerta
            ) VALUES ($1, $2, $3, $4, $5)
        `, [
            herraje.ubicacion,
            herraje.color,
            herraje.cantidad || 1,
            herraje.observacion,
            idEspecificacion
        ]);
    }
}

async function guardarOrdenTrabajo(client, ordenData) {
    const query = `
        INSERT INTO inventario.orden_trabajo (
            orden_trabajo_estado,
            especificaciones_puerta_id_especificacion_puerta,
            area_trabajo_id_area,
            usuario_id_usuario
        ) VALUES ($1, $2, $3, $4)
        RETURNING orden_trabajo_id_orden;
    `;

    const result = await client.query(query, [
        ordenData.estado,
        ordenData.especificaciones_puerta_id_especificacion_puerta,
        ordenData.area_trabajo_id_area,
        ordenData.usuario_id_usuario
    ]);

    return result.rows[0].orden_trabajo_id_orden;
}
