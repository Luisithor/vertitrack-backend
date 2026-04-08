const elevadorModel = require("../models/elevador.model");

const elevadorController = {
  listarElevadoresBasico: async (req, res) => {
    try {
      const elevadores = await elevadorModel.getElevadoresBasico();
      res.json(elevadores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getElevadores: async (req, res) => {
    try {
      const elevadores = await elevadorModel.getAllElevadores();
      res.json(elevadores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getElevadorById: async (req, res) => {
    try {
      const elevador = await elevadorModel.getElevadorById(req.params.id);
      if (!elevador)
        return res.status(404).json({ message: "Elevador no encontrado" });
      res.json(elevador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createElevador: async (req, res) => {
    try {
      console.log("body recibido:", req.body); // ← agregar esto
      const id = await elevadorModel.createElevador(req.body);
      res.status(201).json({ id, message: "Elevador creado con éxito" });
    } catch (error) {
      console.log("error detallado:", error.message); // ← y esto
      res.status(400).json({ error: error.message });
    }
  },

  updateElevador: async (req, res) => {
    try {
      const actualizado = await elevadorModel.updateElevador(
        req.params.id,
        req.body,
      );
      if (!actualizado)
        return res
          .status(404)
          .json({ message: "No se encontró el elevador para actualizar" });
      res.json({ message: "Elevador actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteElevador: async (req, res) => {
    try {
      const eliminado = await elevadorModel.deleteElevador(req.params.id);
      if (!eliminado)
        return res.status(404).json({ message: "No se encontró el elevador" });
      res.json({ message: "Elevador eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getElevadoresByCliente: async (req, res) => {
    try {
      const { id_cliente } = req.params;

      if (!id_cliente) {
        return res
          .status(400)
          .json({ error: "ID de cliente no proporcionado" });
      }

      const elevadores = await elevadorModel.getElevadoresByCliente(id_cliente);

      res.json(elevadores);
    } catch (error) {
      console.error("Error en getElevadoresByCliente:", error);
      res.status(500).json({ error: "Error interno al filtrar activos" });
    }
  },
};

module.exports = elevadorController;
