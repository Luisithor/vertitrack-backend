const sql = require("../config/db"); // Importamos nuestra conexión de Neon

async function getHistorial() {
  const rows = await sql`
    SELECT * FROM "Historial_Mantenimiento"
  `;
  return rows;
}

async function createHistorial(data) {
  const result = await sql`
    INSERT INTO "Historial_Mantenimiento"
    (id_orden, id_elevador, actividades_realizadas, piezas_reemplazadas, observaciones_tecnicas)
    VALUES (
      ${data.id_orden}, 
      ${data.id_elevador}, 
      ${data.actividades_realizadas}, 
      ${data.piezas_reemplazadas}, 
      ${data.observaciones_tecnicas}
    )
    RETURNING id_historial
  `;

  return result[0].id_historial;
}

module.exports = {
  getHistorial,
  createHistorial
};