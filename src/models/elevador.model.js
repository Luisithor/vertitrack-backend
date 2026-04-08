const pool = require("../config/db");

async function getAllElevadores() {
  const query = `
    SELECT e.*, c.nombre_cliente 
    FROM Elevadores e
    JOIN Clientes c ON e.id_cliente = c.id_cliente
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function getElevadorById(id) {
  const query = `
    SELECT e.*, c.nombre_cliente 
    FROM Elevadores e
    JOIN Clientes c ON e.id_cliente = c.id_cliente
    WHERE e.id_elevador = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

async function getElevadoresBasico() {
  const query = `
    SELECT 
      e.id_elevador, 
      e.ubicacion_especifica, 
      e.tipo_equipo, 
      c.nombre_cliente 
    FROM Elevadores e
    JOIN Clientes c ON e.id_cliente = c.id_cliente
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function createElevador(data) {
  const requiredFields = ["id_cliente", "ubicacion_especifica"];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }

  const query = `
    INSERT INTO Elevadores
    (id_cliente, ubicacion_especifica, tipo_equipo,
     frecuencia_mantenimiento, ultima_revision, estatus_operativo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    data.id_cliente,
    data.ubicacion_especifica,
    data.tipo_equipo || null,
    data.frecuencia_mantenimiento || null,
    data.ultima_revision || null,
    data.estatus_operativo || "Activo",
  ]);

  return result.insertId;
}

async function updateElevador(id, data) {
  const actual = await getElevadorById(id);
  if (!actual) return false;

  const query = `
    UPDATE Elevadores SET
      id_cliente = ?,
      ubicacion_especifica = ?,
      tipo_equipo = ?,
      frecuencia_mantenimiento = ?,
      ultima_revision = ?,
      estatus_operativo = ?
    WHERE id_elevador = ?
  `;

  const [result] = await pool.query(query, [
    data.id_cliente || actual.id_cliente,
    data.ubicacion_especifica || actual.ubicacion_especifica,
    data.tipo_equipo || actual.tipo_equipo,
    data.frecuencia_mantenimiento || actual.frecuencia_mantenimiento,
    data.ultima_revision || actual.ultima_revision,
    data.estatus_operativo || actual.estatus_operativo,
    id
  ]);

  return result.affectedRows > 0;
}

async function deleteElevador(id) {
  const query = "DELETE FROM Elevadores WHERE id_elevador = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
}

async function getElevadoresByCliente(idCliente) {
  const query = `
    SELECT e.*, c.nombre_cliente 
    FROM Elevadores e
    JOIN Clientes c ON e.id_cliente = c.id_cliente
    WHERE e.id_cliente = ?
  `;
  const [rows] = await pool.query(query, [idCliente]);
  return rows;
}

module.exports = {
  getAllElevadores,
  getElevadorById,
  getElevadoresBasico,
  createElevador,
  updateElevador,
  deleteElevador,
  getElevadoresByCliente,
};