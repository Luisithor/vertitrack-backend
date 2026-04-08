const sql = require("../config/db"); // Usamos nuestra conexión a Neon

async function getAllElevadores() {
  const rows = await sql`
    SELECT e.*, c.nombre_cliente 
    FROM "Elevadores" e
    JOIN "Clientes" c ON e.id_cliente = c.id_cliente
  `;
  return rows;
}

async function getElevadorById(id) {
  const rows = await sql`
    SELECT e.*, c.nombre_cliente 
    FROM "Elevadores" e
    JOIN "Clientes" c ON e.id_cliente = c.id_cliente
    WHERE e.id_elevador = ${id}
  `;
  return rows[0];
}

async function getElevadoresBasico() {
  const rows = await sql`
    SELECT 
      e.id_elevador, 
      e.ubicacion_especifica, 
      e.tipo_equipo, 
      c.nombre_cliente 
    FROM "Elevadores" e
    JOIN "Clientes" c ON e.id_cliente = c.id_cliente
  `;
  return rows;
}

async function createElevador(data) {
  const requiredFields = ["id_cliente", "ubicacion_especifica"];
  for (const field of requiredFields) {
    if (!data[field]) throw new Error(`El campo ${field} es obligatorio`);
  }

  const result = await sql`
    INSERT INTO "Elevadores"
    (id_cliente, ubicacion_especifica, tipo_equipo,
     frecuencia_mantenimiento, ultima_revision, estatus_operativo)
    VALUES (
      ${data.id_cliente}, 
      ${data.ubicacion_especifica}, 
      ${data.tipo_equipo || null}, 
      ${data.frecuencia_mantenimiento || null}, 
      ${data.ultima_revision || null}, 
      ${data.estatus_operativo || "Activo"}
    )
    RETURNING id_elevador
  `;

  return result[0].id_elevador;
}

async function updateElevador(id, data) {
  const actual = await getElevadorById(id);
  if (!actual) return false;

  const result = await sql`
    UPDATE "Elevadores" SET
      id_cliente = ${data.id_cliente || actual.id_cliente},
      ubicacion_especifica = ${data.ubicacion_especifica || actual.ubicacion_especifica},
      tipo_equipo = ${data.tipo_equipo || actual.tipo_equipo},
      frecuencia_mantenimiento = ${data.frecuencia_mantenimiento || actual.frecuencia_mantenimiento},
      ultima_revision = ${data.ultima_revision || actual.ultima_revision},
      estatus_operativo = ${data.estatus_operativo || actual.estatus_operativo}
    WHERE id_elevador = ${id}
    RETURNING id_elevador
  `;

  return result.length > 0;
}

async function deleteElevador(id) {
  const result = await sql`
    DELETE FROM "Elevadores" 
    WHERE id_elevador = ${id}
    RETURNING id_elevador
  `;
  return result.length > 0;
}

async function getElevadoresByCliente(idCliente) {
  const rows = await sql`
    SELECT e.*, c.nombre_cliente 
    FROM "Elevadores" e
    JOIN "Clientes" c ON e.id_cliente = c.id_cliente
    WHERE e.id_cliente = ${idCliente}
  `;
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