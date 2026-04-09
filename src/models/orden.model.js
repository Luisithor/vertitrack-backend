const sql = require("../config/db"); 

async function getAllOrdenes() {
  const rows = await sql`SELECT * FROM "Ordenes_Trabajo"`;
  return rows;
}

async function createOrden(data) {
  const result = await sql`
    INSERT INTO "Ordenes_Trabajo" (id_falla, fecha_limite, piezas_requeridas)
    VALUES (${data.id_falla}, ${data.fecha_limite}, ${data.piezas_requeridas})
    RETURNING id_orden
  `;

  return result[0].id_orden;
}

async function updateOrden(id, data) {
  const result = await sql`
    UPDATE "Ordenes_Trabajo"
    SET estado_orden = ${data.estado_orden}, 
        piezas_requeridas = ${data.piezas_requeridas}, 
        fecha_limite = ${data.fecha_limite}
    WHERE id_orden = ${id}
    RETURNING id_orden
  `;

  return result.length > 0;
}

async function deleteOrden(id) {
  const result = await sql`
    DELETE FROM "Ordenes_Trabajo" 
    WHERE id_orden = ${id}
    RETURNING id_orden
  `;
    
  return result.length > 0;
}

module.exports = {
  getAllOrdenes,
  createOrden,
  updateOrden,
  deleteOrden 
};