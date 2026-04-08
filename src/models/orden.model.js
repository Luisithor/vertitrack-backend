const pool = require("../config/db");

async function getAllOrdenes() {
  const [rows] = await pool.query("SELECT * FROM Ordenes_Trabajo");
  return rows;
}

async function createOrden(data) {

  const query = `
  INSERT INTO Ordenes_Trabajo
  (id_falla, fecha_limite, piezas_requeridas)
  VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    data.id_falla,
    data.fecha_limite,
    data.piezas_requeridas
  ]);

  return result.insertId;
}

async function updateOrden(id, data) {

  const query = `
  UPDATE Ordenes_Trabajo
  SET estado_orden = ?, piezas_requeridas = ?, fecha_limite = ?
  WHERE id_orden = ?
  `;

  const [result] = await pool.query(query, [
    data.estado_orden,
    data.piezas_requeridas,
    data.fecha_limite,
    id
  ]);

  return result.affectedRows > 0;
}

async function deleteOrden(id) {
  const [result] = await pool.query(
    "DELETE FROM Ordenes_Trabajo WHERE id_orden = ?",
    [id]
  );
    return result.affectedRows > 0;
}

module.exports = {
  getAllOrdenes,
  createOrden,
  updateOrden
};