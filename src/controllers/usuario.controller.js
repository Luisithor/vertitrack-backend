const Usuario = require("../models/usuario.model");

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener la lista de usuarios" });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.getUsuarioById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al consultar el usuario" });
  }
};

exports.listarUsuariosIdNombre = async (req, res) => {
  try {
    const usuarios = await Usuario.getUsuariosIdNombre();
    res.json(usuarios);
  } catch (error) {
    console.error("Error en listado simple:", error);
    res.status(500).json({ error: "Error al obtener el listado simple" });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const id = await Usuario.createUsuario(req.body);
    res.status(201).json({
      message: "Usuario creado correctamente",
      id,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const ok = await Usuario.updateUsuario(req.params.id, req.body);
    if (!ok) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

exports.solicitudCambioRol = async (req, res) => {
  try {
    res.json({
      message: "Funcionalidad de cambio de rol pendiente de implementación",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar cambio de rol" });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const ok = await Usuario.deleteUsuario(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

exports.actualizarToken = async (req, res) => {
  try {
    const { id_usuario, token_push } = req.body;

    if (!id_usuario || !token_push) {
      return res
        .status(400)
        .json({ error: "ID de usuario y token son requeridos" });
    }

    const idNumerico = Number(id_usuario);

    const ok = await Usuario.updateTokenPush(idNumerico, token_push);

    if (!ok) {
      return res.status(404).json({ error: `Usuario con ID ${idNumerico} no encontrado` });
    }

    res.json({ message: "Token push actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar token push:", error);
    res.status(500).json({ error: "Error interno al guardar token" });
  }
};
