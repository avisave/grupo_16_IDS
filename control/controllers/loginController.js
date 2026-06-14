import { obtenerUsuarioPorRut } from "../models/usuarioModel.js";

export const login = async (req, res) => {
  try {
    const { rut, contrasena } = req.body;

    if (!rut || !contrasena) {
      return res.status(400).json({
        success: false,
        mensaje: "RUT y contraseña son obligatorios"
      });
    }

    const usuario = await obtenerUsuarioPorRut(rut);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales inválidas"
      });
    }

    const passwordValida = contrasena === usuario.usuario_contrasena;

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales inválidas"
      });
    }

    return res.status(200).json({
      success: true,
      usuario: {
        id: usuario.usuario_id_usuario,
        username: usuario.usuario_username,
        rut: usuario.usuario_rut_usuario,
        correo: usuario.usuario_correo,
        administrador: usuario.usuario_es_administrador,
        tecnico: usuario.usuario_es_tecnico,
        gerencia: usuario.usuario_es_gerencia
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
