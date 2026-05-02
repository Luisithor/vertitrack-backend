const Falla = require("../models/falla.model");
const Usuario = require("../models/usuario.model"); // Necesitas acceso a los tokens
const admin = require("firebase-admin");

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

const notificarTecnicos = async (fallaData) => {
  try {
    if (fallaData.urgencia !== "Crítica" && fallaData.urgencia !== "Alta")
      return;

const usuariosConToken = await Usuario.getTokensActivos(); // Usa el nombre correcto del modelo

    if (!usuariosConToken || usuariosConToken.length === 0) return;

    const tokens = usuariosConToken.map((u) => u.token_push).filter((t) => t);

    const message = {
      notification: {
        title: `FALLA ${fallaData.urgencia.toUpperCase()}`,
        body: `${fallaData.tipo_falla} - Revisar Vertitrack PWA`,
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        url: "/fallas",
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Notificaciones enviadas: ${response.successCount}`);
  } catch (error) {
    console.error("Error al enviar notificaciones push:", error);
  }
};

exports.createFalla = async (req, res) => {
  try {
    const id = await Falla.createFalla(req.body);

    if (req.body.urgencia === "Crítica" || req.body.urgencia === "Alta") {
      notificarTecnicos(req.body); 
    }

    res.status(201).json({ message: "Reporte creado", id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateFalla = async (req, res) => {
  try {
    const ok = await Falla.updateFalla(req.params.id, req.body);

    if (!ok) {
      return res.status(404).json({ error: "Falla no encontrada" });
    }

    if (req.body.urgencia === "Crítica") {
      notificarTecnicos(req.body);
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
