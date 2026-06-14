import * as clienteModel from "../models/clienteModel.js";

const joinNombre = (...partes) =>
  partes.filter((p) => p && String(p).trim() !== "").join(" ").trim();

function toViewModel(row) {
  if (row.es_cliente_b2b) {
    return {
      identificador: row.rut_cliente,
      tipo: "B2B",
      nombre: row.cliente_b2b_razon_social || row.razon_social,
      telefono: row.cliente_b2b_telefono_corporativo || row.telefono,
      telefono_adicional: row.cliente_b2b_telefono_corp_adicional || "",
      email: row.cliente_b2b_correo_institucional || row.correo,
      fecha_actualizacion: row.cliente_b2b_fecha_ultima_edicion,
      representante_legal: joinNombre(
        row.cliente_b2b_representante_legal_primer_nombre,
        row.cliente_b2b_representante_legal_segundo_nombre,
        row.cliente_b2b_representante_legal_primer_apellido,
        row.cliente_b2b_representante_legal_segundo_apellido
      ),
      cliente_b2b_razon_social: row.cliente_b2b_razon_social,
      cliente_b2b_correo_institucional: row.cliente_b2b_correo_institucional,
      cliente_b2b_telefono_corporativo: row.cliente_b2b_telefono_corporativo,
      cliente_b2b_telefono_corp_adicional: row.cliente_b2b_telefono_corp_adicional || "",
      cliente_b2b_representante_legal_primer_nombre: row.cliente_b2b_representante_legal_primer_nombre || "",
      cliente_b2b_representante_legal_segundo_nombre: row.cliente_b2b_representante_legal_segundo_nombre || "",
      cliente_b2b_representante_legal_primer_apellido: row.cliente_b2b_representante_legal_primer_apellido || "",
      cliente_b2b_representante_legal_segundo_apellido: row.cliente_b2b_representante_legal_segundo_apellido || ""
    };
  }

  return {
    identificador: row.rut_cliente,
    tipo: "B2C",
    nombre:
      joinNombre(
        row.cliente_b2c_primer_nombre,
        row.cliente_b2c_segundo_nombre,
        row.cliente_b2c_primer_apellido,
        row.cliente_b2c_segundo_apellido
      ) || row.contacto_principal,
    telefono: row.cliente_b2c_telefono_contacto || row.telefono,
    telefono_adicional: row.cliente_b2c_telefono_contacto_adicional || "",
    email: row.cliente_b2c_correo || row.correo,
    fecha_actualizacion: row.cliente_b2c_fecha_ultima_edicion,
    cliente_b2c_primer_nombre: row.cliente_b2c_primer_nombre || "",
    cliente_b2c_segundo_nombre: row.cliente_b2c_segundo_nombre || "",
    cliente_b2c_primer_apellido: row.cliente_b2c_primer_apellido || "",
    cliente_b2c_segundo_apellido: row.cliente_b2c_segundo_apellido || "",
    cliente_b2c_telefono_contacto: row.cliente_b2c_telefono_contacto || "",
    cliente_b2c_telefono_contacto_adicional: row.cliente_b2c_telefono_contacto_adicional || ""
  };
}

function construirDatos(body, esNuevo) {
  const ahora = new Date();

  if (body.tipo === "B2B") {
    const representante = joinNombre(
      body.cliente_b2b_representante_legal_primer_nombre,
      body.cliente_b2b_representante_legal_segundo_nombre,
      body.cliente_b2b_representante_legal_primer_apellido,
      body.cliente_b2b_representante_legal_segundo_apellido
    );

    const data = {
      razon_social: body.cliente_b2b_razon_social,
      contacto_principal: representante,
      correo: body.cliente_b2b_correo_institucional || body.correo,
      telefono: body.cliente_b2b_telefono_corporativo || body.telefono,
      es_cliente_b2c: false,
      es_cliente_b2b: true,
      cliente_b2b_correo_institucional: body.cliente_b2b_correo_institucional,
      cliente_b2b_telefono_corporativo: body.cliente_b2b_telefono_corporativo,
      cliente_b2b_telefono_corp_adicional:
        body.cliente_b2b_telefono_corp_adicional || null,
      cliente_b2b_razon_social: body.cliente_b2b_razon_social,
      cliente_b2b_representante_legal_primer_nombre:
        body.cliente_b2b_representante_legal_primer_nombre,
      cliente_b2b_representante_legal_primer_apellido:
        body.cliente_b2b_representante_legal_primer_apellido,
      cliente_b2b_fecha_ultima_edicion: ahora,
    };

    if (esNuevo) {
      data.rut_cliente = body.rut_cliente;
      data.cliente_b2b_rut_empresa = body.rut_cliente;
      data.cliente_b2b_fecha_registro = ahora;
      data.cliente_b2b_representante_legal_segundo_nombre =
        body.cliente_b2b_representante_legal_segundo_nombre || null;
      data.cliente_b2b_representante_legal_segundo_apellido =
        body.cliente_b2b_representante_legal_segundo_apellido || null;
    } else {
      if (body.cliente_b2b_representante_legal_segundo_nombre !== undefined && body.cliente_b2b_representante_legal_segundo_nombre !== "") {
        data.cliente_b2b_representante_legal_segundo_nombre = body.cliente_b2b_representante_legal_segundo_nombre;
      }
      if (body.cliente_b2b_representante_legal_segundo_apellido !== undefined && body.cliente_b2b_representante_legal_segundo_apellido !== "") {
        data.cliente_b2b_representante_legal_segundo_apellido = body.cliente_b2b_representante_legal_segundo_apellido;
      }
    }

    return data;
  }

  const nombreCompleto = joinNombre(
    body.cliente_b2c_primer_nombre,
    body.cliente_b2c_segundo_nombre,
    body.cliente_b2c_primer_apellido,
    body.cliente_b2c_segundo_apellido
  );

  const data = {
    razon_social: nombreCompleto,
    contacto_principal: nombreCompleto,
    correo: body.correo,
    telefono: body.cliente_b2c_telefono_contacto || body.telefono,
    es_cliente_b2c: true,
    es_cliente_b2b: false,
    cliente_b2c_correo: body.correo,
    cliente_b2c_primer_nombre: body.cliente_b2c_primer_nombre,
    cliente_b2c_primer_apellido: body.cliente_b2c_primer_apellido,
    cliente_b2c_telefono_contacto: body.cliente_b2c_telefono_contacto,
    cliente_b2c_telefono_contacto_adicional:
      body.cliente_b2c_telefono_contacto_adicional || null,
    cliente_b2c_fecha_ultima_edicion: ahora,
  };

  if (esNuevo) {
    data.rut_cliente = body.rut_cliente;
    data.cliente_b2c_rut = body.rut_cliente;
    data.cliente_b2c_fecha_registro = ahora;
    data.cliente_b2c_segundo_nombre = body.cliente_b2c_segundo_nombre || null;
    data.cliente_b2c_segundo_apellido = body.cliente_b2c_segundo_apellido || null;
  } else {
    if (body.cliente_b2c_segundo_nombre !== undefined && body.cliente_b2c_segundo_nombre !== "") {
      data.cliente_b2c_segundo_nombre = body.cliente_b2c_segundo_nombre;
    }
    if (body.cliente_b2c_segundo_apellido !== undefined && body.cliente_b2c_segundo_apellido !== "") {
      data.cliente_b2c_segundo_apellido = body.cliente_b2c_segundo_apellido;
    }
  }

  return data;
}

function validarPayload(body, { exigirRut }) {
  if (!body.tipo || !["B2C", "B2B"].includes(body.tipo)) {
    return "El campo 'tipo' debe ser 'B2C' o 'B2B'.";
  }

  if (exigirRut) {
    if (!body.rut_cliente || String(body.rut_cliente).trim() === "") {
      return "El RUT/identificador del cliente es obligatorio.";
    }
    if (String(body.rut_cliente).length > 12) {
      return "El RUT/identificador no puede exceder 12 caracteres.";
    }
  }

  if (body.tipo === "B2C") {
    if (!body.cliente_b2c_primer_nombre || !body.cliente_b2c_primer_apellido) {
      return "Nombre y apellido son obligatorios para clientes B2C.";
    }
    if (!body.correo) {
      return "El correo es obligatorio para clientes B2C.";
    }
    if (!body.cliente_b2c_telefono_contacto) {
      return "El teléfono de contacto es obligatorio para clientes B2C.";
    }
  } else {
    if (!body.cliente_b2b_razon_social) {
      return "La razón social es obligatoria para clientes B2B.";
    }
    if (!body.cliente_b2b_correo_institucional) {
      return "El correo institucional es obligatorio para clientes B2B.";
    }
    if (!body.cliente_b2b_telefono_corporativo) {
      return "El teléfono corporativo es obligatorio para clientes B2B.";
    }
    if (
      !body.cliente_b2b_representante_legal_primer_nombre ||
      !body.cliente_b2b_representante_legal_primer_apellido
    ) {
      return "El nombre y apellido del representante legal son obligatorios.";
    }
  }

  return null;
}

export async function getClientes(req, res) {
  try {
    const rows = await clienteModel.findAll();
    const clientes = rows.map(toViewModel);
    res.json({ ok: true, clientes });
  } catch (err) {
    console.error("ERROR getClientes:", err);
    res.status(500).json({ ok: false, msg: "Error al obtener los clientes." });
  }
}

export async function createCliente(req, res) {
  try {
    const error = validarPayload(req.body, { exigirRut: true });
    if (error) {
      return res.status(400).json({ ok: false, msg: error });
    }

    const existente = await clienteModel.findByRut(req.body.rut_cliente);
    if (existente) {
      return res
        .status(409)
        .json({ ok: false, msg: "Ya existe un cliente con ese RUT/identificador." });
    }

    const data = construirDatos(req.body, true);
    await clienteModel.create(data);

    res.json({ ok: true, msg: "Cliente registrado correctamente." });
  } catch (err) {
    console.error("ERROR createCliente:", err);
    res.status(500).json({ ok: false, msg: "Error al registrar el cliente." });
  }
}

export async function updateCliente(req, res) {
  try {
    const { rut } = req.params;

    const existente = await clienteModel.findByRut(rut);
    if (!existente) {
      return res.status(404).json({ ok: false, msg: "Cliente no encontrado." });
    }

    const error = validarPayload(req.body, { exigirRut: false });
    if (error) {
      return res.status(400).json({ ok: false, msg: error });
    }

    const data = construirDatos(req.body, false);
    await clienteModel.update(rut, data);

    res.json({ ok: true, msg: "Cliente actualizado correctamente." });
  } catch (err) {
    console.error("ERROR updateCliente:", err);
    res.status(500).json({ ok: false, msg: "Error al actualizar el cliente." });
  }
}

export async function getClientesSelector(req, res) {
  try {
    const rows = await clienteModel.findAll();
    const clientes = rows.map(r => ({ rut: r.rut_cliente, nombre: r.razon_social }));
    res.json({ ok: true, clientes });
  } catch (err) {
    console.error("ERROR getClientesSelector:", err);
    res.status(500).json({ ok: false, msg: "Error al obtener clientes para selector" });
  }
}
