const sql = require("../config/db");

async function getAllFallas() {
  const rows = await sql`
    SELECT 
      rf.*, 
      e.ubicacion_especifica, 
      c.nombre_cliente,
      u.nombre AS nombre_usuario 
    FROM "Reportes_Fallas" rf
    JOIN "Elevadores" e ON rf.id_elevador = e.id_elevador
    JOIN "Clientes" c ON e.id_cliente = c.id_cliente
    LEFT JOIN "Usuarios" u ON rf.id_usuario = u.id_usuario
    ORDER BY rf.fecha_reporte DESC
  `;
  return rows;
}

async function getFallaById(id) {
  const rows = await sql`
    SELECT rf.*, u.nombre AS nombre_usuario
    FROM "Reportes_Fallas" rf
    LEFT JOIN "Usuarios" u ON rf.id_usuario = u.id_usuario
    WHERE rf.id_falla = ${id}
  `;
  return rows[0];
}

async function createFalla(data) {
  const result = await sql`
    INSERT INTO "Reportes_Fallas"
    (id_elevador, id_usuario, tipo_falla, descripcion_falla, urgencia, estado_reporte)
    VALUES (
      ${data.id_elevador}, 
      ${data.id_usuario || null}, 
      ${data.tipo_falla}, 
      ${data.descripcion_falla}, 
      ${data.urgencia || "Media"}, 
      ${data.estado_reporte || "Pendiente"}
    )
    RETURNING id_falla
  `;

  return result[0].id_falla;
}

async function updateFalla(id, data) {
  const result = await sql`
    UPDATE "Reportes_Fallas" SET
      tipo_falla = ${data.tipo_falla},
      descripcion_falla = ${data.descripcion_falla},
      urgencia = ${data.urgencia},
      estado_reporte = ${data.estado_reporte}
    WHERE id_falla = ${id}
    RETURNING id_falla
  `;

  return result.length > 0;
}

async function deleteFalla(id) {
  const result = await sql`
    DELETE FROM "Reportes_Fallas" 
    WHERE id_falla = ${id}
    RETURNING id_falla
  `;

  return result.length > 0;
}

module.exports = {
  getAllFallas,
  getFallaById,
  createFalla,
  updateFalla,
  deleteFalla,
};