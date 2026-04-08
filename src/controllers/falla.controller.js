const Falla = require("../models/falla.model");

exports.getFallas = async (req, res) => {
  try {
    const fallas = await Falla.getAllFallas();
    res.json(fallas);
  } catch (error) {
    console.error("Error en getFallas:", error);
    res.status(500).json({ error: "Error al obtener fallas" });
  }
};

exports.getFallaById = async (req, res) => {
  try {
    const falla = await Falla.getFallaById(req.params.id);

    if (!falla) {
      return res.status(404).json({ error: "Falla no encontrada" });
    }

    res.json(falla);
  } catch (error) {
    console.error("Error en getFallaById:", error);
    res.status(500).json({ error: "Error al obtener falla" });
  }
};

exports.createFalla = async (req, res) => {
  try {
    // CORRECCIÓN: Extraemos las variables del body antes de validarlas
    const { id_elevador, tipo_falla } = req.body;

    if (!id_elevador || !tipo_falla) {
      return res.status(400).json({
        error: "Faltan campos obligatorios (id_elevador, tipo_falla)",
      });
    }

    const id = await Falla.createFalla(req.body);

    res.status(201).json({
      message: "Reporte creado",
      id,
    });
  } catch (error) {
    console.error("Error en createFalla:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateFalla = async (req, res) => {
  try {
    const ok = await Falla.updateFalla(req.params.id, req.body);

    if (!ok) {
      return res.status(404).json({ error: "Falla no encontrada" });
    }

    res.json({ message: "Reporte actualizado" });
  } catch (error) {
    console.error("Error en updateFalla:", error);
    res.status(500).json({ error: "Error al actualizar reporte" });
  }
};

exports.deleteFalla = async (req, res) => {
  try {
    const ok = await Falla.deleteFalla(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: "Falla no encontrada" });
    }

    res.json({ message: "Reporte eliminado" });
  } catch (error) {
    console.error("Error en deleteFalla:", error);
    res.status(500).json({ error: "Error al eliminar reporte" });
  }
};