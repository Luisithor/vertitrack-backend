const pool = require("../config/db");

async function getHistorial() {

  const [rows] = await pool.query(`
  SELECT * FROM Historial_Mantenimiento
  `);

  return rows;
}

async function createHistorial(data) {

  const query = `
  INSERT INTO Historial_Mantenimiento
  (id_orden, id_elevador, actividades_realizadas, piezas_reemplazadas, observaciones_tecnicas)
  VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    data.id_orden,
    data.id_elevador,
    data.actividades_realizadas,
    data.piezas_reemplazadas,
    data.observaciones_tecnicas
  ]);

  return result.insertId;
}

module.exports = {
  getHistorial,
  createHistorial
};