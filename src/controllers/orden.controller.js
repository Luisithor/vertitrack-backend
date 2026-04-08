const Orden = require("../models/orden.model");

exports.getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.getAllOrdenes();
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

exports.createOrden = async (req, res) => {
  try {
    const id = await Orden.createOrden(req.body);

    res.status(201).json({
      message: "Orden creada correctamente",
      id
    });

  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrden = async (req, res) => {
  try {

    const ok = await Orden.updateOrden(req.params.id, req.body);

    if (!ok) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ message: "Orden actualizada correctamente" });

  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ error: "Error al actualizar orden" });
  }
};

exports.deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Orden.deleteOrden(id); // Asegúrate de que esta función exista en tu modelo Orden

    if (!ok) {
      return res.status(404).json({ error: "Orden no encontrada para eliminar" });
    }

    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    res.status(500).json({ error: "Error al eliminar la orden" });
  }
};