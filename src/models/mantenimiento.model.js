const pool = require("../config/db");

async function getAllMantenimientos() {
  const query = `
    SELECT 
      m.*, 
      e.ubicacion_especifica, 
      c.nombre_cliente,
      u.nombre as nombre_usuario  -- <--- ESTO ES LO QUE FALTA
    FROM mantenimientos m
    JOIN Elevadores e ON m.id_elevador = e.id_elevador
    JOIN Clientes c ON e.id_cliente = c.id_cliente
    JOIN Usuarios u ON m.id_usuario = u.id_usuario -- <--- Y ESTO
    ORDER BY m.fecha_servicio DESC
  `;
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error en SQL getAllMantenimientos:", error);
    throw error;
  }
}

async function getMantenimientoById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM mantenimientos WHERE id_mantenimiento = ?",
    [id],
  );
  return rows[0];
}

async function registrarMantenimiento(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const queryMaint = `INSERT INTO mantenimientos 
      (id_elevador, id_usuario, fecha_servicio, actividades, piezas_reemplazadas, observaciones_tecnicas) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    const [maintResult] = await connection.query(queryMaint, [
      data.id_elevador,
      data.id_usuario,
      data.fecha_servicio,
      data.actividades,
      data.piezas_reemplazadas || null,
      data.observaciones_tecnicas || null,
    ]);

    await connection.query(
      "UPDATE Elevadores SET ultima_revision = ? WHERE id_elevador = ?",
      [data.fecha_servicio, data.id_elevador],
    );

    if (data.requiereOT) {
      const queryFalla = `INSERT INTO Reportes_Fallas 
        (id_elevador, tipo_falla, descripcion_falla, urgencia, estado_reporte) 
        VALUES (?, ?, ?, ?, ?)`;

      const [fallaRes] = await connection.query(queryFalla, [
        data.id_elevador,
        "Correctivo post-mantenimiento",
        `Detectado en mantenimiento: ${data.observaciones_tecnicas || "Sin observaciones"}`,
        "Media",
        "En Proceso",
      ]);

      const queryOT = `INSERT INTO Ordenes_Trabajo 
        (id_falla, responsable, fecha_limite, piezas_requeridas, subtotal, iva, importe_total, estado_orden) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      await connection.query(queryOT, [
        fallaRes.insertId,
        data.ot_responsable,
        data.ot_fecha_limite,
        data.piezas_reemplazadas,
        data.ot_subtotal || 0,
        data.ot_iva || 0,
        data.ot_total || 0,
        "Abierta",
      ]);
    }

    await connection.commit();
    return maintResult.insertId;
  } catch (error) {
    await connection.rollback();
    console.error("Error en registrarMantenimiento (Transaction):", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function updateMantenimiento(id, data) {
  const query = `UPDATE mantenimientos SET fecha_servicio = ?, actividades = ?, piezas_reemplazadas = ?, observaciones_tecnicas = ? WHERE id_mantenimiento = ?`;
  const [result] = await pool.query(query, [
    data.fecha_servicio,
    data.actividades,
    data.piezas_reemplazadas,
    data.observaciones_tecnicas,
    id,
  ]);
  return result.affectedRows > 0;
}

async function deleteMantenimiento(id) {
  const query = "DELETE FROM mantenimientos WHERE id_mantenimiento = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
}

async function getHistorialByElevador(id_elevador) {
  const query =
    "SELECT * FROM mantenimientos WHERE id_elevador = ? ORDER BY fecha_servicio DESC";
  const [rows] = await pool.query(query, [id_elevador]);
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
