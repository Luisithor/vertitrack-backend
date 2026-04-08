const pool = require("../config/db");

async function getClientes() {
  const [rows] = await pool.query(`
        SELECT * FROM Clientes
        ORDER BY id_cliente DESC
    `);
  return rows;
}

async function getClienteById(id) {
  const [rows] = await pool.query(
    `
        SELECT * FROM Clientes
        WHERE id_cliente = ?
    `,
    [id],
  );

  return rows[0];
}

async function createCliente(data) {
  const { nombre_cliente, contacto, direccion } = data;

  const [result] = await pool.query(
    `
        INSERT INTO Clientes (nombre_cliente, contacto, direccion)
        VALUES (?, ?, ?)
    `,
    [nombre_cliente, contacto, direccion],
  );

  return {
    id_cliente: result.insertId,
  };
}

async function updateCliente(id, data) {
  const { nombre_cliente, contacto, direccion } = data;

  const [result] = await pool.query(
    `
        UPDATE Clientes
        SET nombre_cliente = ?, 
            contacto = ?, 
            direccion = ?
        WHERE id_cliente = ?
    `,
    [nombre_cliente, contacto, direccion, id],
  );
  return result.affectedRows > 0;
}

async function deleteCliente(id) {
  const [result] = await pool.query("DELETE FROM Clientes WHERE id_cliente = ?", [
    id,
  ]);

  return result.affectedRows > 0;
}

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
