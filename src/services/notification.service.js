const admin = require("firebase-admin");
const Usuario = require("../models/usuario.model");

const sendPushToTechs = async (falla) => {
  try {
    const result = await Usuario.getTokensActivos();
    const tokens = result.map(u => u.token_push).filter(t => t != null);

    if (tokens.length === 0) {
      console.log("⚠️ No hay tokens registrados para enviar notificaciones.");
      return;
    }

    const message = {
      notification: {
        title: `🚨 FALLA ${falla.urgencia.toUpperCase()}`,
        body: `${falla.tipo_falla} en ${falla.nombre_cliente || 'ubicación asignada'}`
      },
      data: {
        url: "/reporte-falla", // URL para que el Service Worker sepa a dónde llevar al usuario
      },
      tokens: tokens
    };

    // 3. Enviar (Multicast permite hasta 500 tokens a la vez)
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ Notificaciones enviadas: ${response.successCount}`);
    
    // Opcional: Si hay tokens que fallaron (expiraron), podrías limpiarlos aquí
  } catch (error) {
    console.error("❌ Error en el servicio de notificaciones:", error);
  }
};

module.exports = { sendPushToTechs };