const Historial = require("../models/historial.model");

exports.getHistorial = async (req, res) => {
  try {

    const historial = await Historial.getHistorial();
    res.json(historial);

  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
};

exports.createHistorial = async (req, res) => {
  try {

    const id = await Historial.createHistorial(req.body);

    res.status(201).json({
      message: "Registro de mantenimiento creado",
      id
    });

  } catch (error) {
    console.error("Error al crear historial:", error);
    res.status(400).json({ error: error.message });
  }
};