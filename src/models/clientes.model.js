const sql = require("../config/db"); 

async function getClientes() {
  const rows = await sql`
    SELECT * FROM "Clientes"
    ORDER BY id_cliente DESC
  `;
  return rows;
}

async function getClienteById(id) {
  const rows = await sql`
    SELECT * FROM "Clientes"
    WHERE id_cliente = ${id}
  `;
  return rows[0];
}

async function createCliente(data) {
  const { nombre_cliente, contacto, direccion } = data;

  const result = await sql`
    INSERT INTO "Clientes" (nombre_cliente, contacto, direccion)
    VALUES (${nombre_cliente}, ${contacto}, ${direccion})
    RETURNING id_cliente
  `;

  return {
    id_cliente: result[0].id_cliente,
  };
}

async function updateCliente(id, data) {
  const { nombre_cliente, contacto, direccion } = data;

  const result = await sql`
    UPDATE "Clientes"
    SET nombre_cliente = ${nombre_cliente}, 
        contacto = ${contacto}, 
        direccion = ${direccion}
    WHERE id_cliente = ${id}
    RETURNING id_cliente
  `;
  
  return result.length > 0;
}

async function deleteCliente(id) {
  const result = await sql`
    DELETE FROM "Clientes" 
    WHERE id_cliente = ${id}
    RETURNING id_cliente
  `;

  return result.length > 0;
}

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};