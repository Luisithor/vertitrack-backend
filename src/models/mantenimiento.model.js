const sql = require("../config/db");

async function getAllMantenimientos() {
  try {
    const rows = await sql`
      SELECT 
        m.*, 
        e.ubicacion_especifica, 
        c.nombre_cliente,
        u.nombre as nombre_usuario  
      FROM "Mantenimientos" m
      JOIN "Elevadores" e ON m.id_elevador = e.id_elevador
      JOIN "Clientes" c ON e.id_cliente = c.id_cliente
      JOIN "Usuarios" u ON m.id_usuario = u.id_usuario 
      ORDER BY m.fecha_servicio DESC
    `;
    return rows;
  } catch (error) {
    console.error("Error en getAllMantenimientos:", error);
    throw error;
  }
}

async function getMantenimientoById(id) {
  const rows = await sql`
    SELECT * FROM "Mantenimientos" WHERE id_mantenimiento = ${id}
  `;
  return rows[0];
}

async function registrarMantenimiento(data) {
  try {
    return await sql.transaction(async (tx) => {
      
      const [maintResult] = await tx`
        INSERT INTO "Mantenimientos" 
        (id_elevador, id_usuario, fecha_servicio, actividades, piezas_reemplazadas, observaciones_tecnicas) 
        VALUES (
          ${data.id_elevador}, ${data.id_usuario}, ${data.fecha_servicio}, 
          ${data.actividades}, ${data.piezas_reemplazadas || null}, ${data.observaciones_tecnicas || null}
        )
        RETURNING id_mantenimiento
      `;

      await tx`
        UPDATE "Elevadores" SET ultima_revision = ${data.fecha_servicio} 
        WHERE id_elevador = ${data.id_elevador}
      `;

      if (data.requiereOT) {
        const [fallaRes] = await tx`
          INSERT INTO "Reportes_Fallas" 
          (id_elevador, tipo_falla, descripcion_falla, urgencia, estado_reporte) 
          VALUES (
            ${data.id_elevador}, 
            'Correctivo post-mantenimiento', 
            ${`Detectado en mantenimiento: ${data.observaciones_tecnicas || "Sin observaciones"}`}, 
            'Media', 
            'En Proceso'
          )
          RETURNING id_falla
        `;

        await tx`
          INSERT INTO "Ordenes_Trabajo" 
          (id_falla, responsable, fecha_limite, piezas_requeridas, subtotal, iva, importe_total, estado_orden) 
          VALUES (
            ${fallaRes.id_falla}, ${data.ot_responsable}, ${data.ot_fecha_limite}, 
            ${data.piezas_reemplazadas}, ${data.ot_subtotal || 0}, ${data.ot_iva || 0}, 
            ${data.ot_total || 0}, 'Abierta'
          )
        `;
      }

      return maintResult.id_mantenimiento;
    });
  } catch (error) {
    console.error("Error en registrarMantenimiento (Transaction):", error);
    throw error;
  }
}

async function updateMantenimiento(id, data) {
  const result = await sql`
    UPDATE "Mantenimientos" SET 
      fecha_servicio = ${data.fecha_servicio}, 
      actividades = ${data.actividades}, 
      piezas_reemplazadas = ${data.piezas_reemplazadas}, 
      observaciones_tecnicas = ${data.observaciones_tecnicas} 
    WHERE id_mantenimiento = ${id}
    RETURNING id_mantenimiento
  `;
  return result.length > 0;
}

async function deleteMantenimiento(id) {
  const result = await sql`
    DELETE FROM "Mantenimientos" WHERE id_mantenimiento = ${id}
    RETURNING id_mantenimiento
  `;
  return result.length > 0;
}

async function getHistorialByElevador(id_elevador) {
  const rows = await sql`
    SELECT * FROM "Mantenimientos" 
    WHERE id_elevador = ${id_elevador} 
    ORDER BY fecha_servicio DESC
  `;
  return rows;
}

module.exports = {
  getAllMantenimientos,
  getMantenimientoById,
  registrarMantenimiento,
  updateMantenimiento,
  deleteMantenimiento,
  getHistorialByElevador,
};