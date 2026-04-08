const pool = require("../config/db");

async function getAllFallas() {
  const query = `
    SELECT 
      rf.*, 
      e.ubicacion_especifica, 
      c.nombre_cliente,
      u.nombre AS nombre_usuario 
    FROM Reportes_Fallas rf
    JOIN Elevadores e ON rf.id_elevador = e.id_elevador
    JOIN Clientes c ON e.id_cliente = c.id_cliente
    LEFT JOIN Usuarios u ON rf.id_usuario = u.id_usuario
    ORDER BY rf.fecha_reporte DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function getFallaById(id) {
  const query = `
    SELECT rf.*, u.nombre AS nombre_usuario
    FROM Reportes_Fallas rf
    LEFT JOIN Usuarios u ON rf.id_usuario = u.id_usuario
    WHERE rf.id_falla = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

async function createFalla(data) {
  const query = `
    INSERT INTO Reportes_Fallas
    (id_elevador, id_usuario, tipo_falla, descripcion_falla, urgencia, estado_reporte)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    data.id_elevador,
    data.id_usuario, // <--- Guardamos el ID del usuario logueado
    data.tipo_falla,
    data.descripcion_falla,
    data.urgencia || "Media",
    data.estado_reporte || "Pendiente"
  ]);

  return result.insertId;
}

async function updateFalla(id, data) {
  const query = `
    UPDATE Reportes_Fallas SET
    tipo_falla = ?,
    descripcion_falla = ?,
    urgencia = ?,
    estado_reporte = ?
    WHERE id_falla = ?
  `;

  const [result] = await pool.query(query, [
    data.tipo_falla,
    data.descripcion_falla,
    data.urgencia,
    data.estado_reporte,
    id,
  ]);

  return result.affectedRows > 0;
}

async function deleteFalla(id) {
  const [result] = await pool.query(
    "DELETE FROM Reportes_Fallas WHERE id_falla = ?",
    [id],
  );

  return result.affectedRows > 0;
}

module.exports = {
  getAllFallas,
  getFallaById,
  createFalla,
  updateFalla,
  deleteFalla,
};