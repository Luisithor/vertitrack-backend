const mantenimientoModel = require("../models/mantenimiento.model");

const mantenimientoController = {

  getAllMantenimientos: async (req, res) => {
    try {
      const mantenimientos = await mantenimientoModel.getAllMantenimientos();
      res.json(mantenimientos);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },

  getById: async (req, res) => {
    try {
      const data = await mantenimientoModel.getMantenimientoById(req.params.id);
      res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },

  crear: async (req, res) => {
    try {
      const id = await mantenimientoModel.registrarMantenimiento(req.body);
      res.status(201).json({ id, message: "Creado con éxito" });
    } catch (error) { res.status(400).json({ error: error.message }); }
  },

  actualizar: async (req, res) => {
    try {
      const ok = await mantenimientoModel.updateMantenimiento(req.params.id, req.body);
      if (!ok) return res.status(404).json({ message: "No encontrado" });
      res.json({ message: "Actualizado correctamente" });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },

  eliminar: async (req, res) => {
    try {
      const ok = await mantenimientoModel.deleteMantenimiento(req.params.id);
      res.json({ message: "Eliminado con éxito" });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },

  listarPorElevador: async (req, res) => {
    try {
      const historial = await mantenimientoModel.getHistorialByElevador(req.params.id_elevador);
      res.json(historial);
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};

module.exports = mantenimientoController;