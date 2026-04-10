const sql = require("../config/db");
const bcrypt = require("bcryptjs");

async function getAllUsuarios() {
  const rows = await sql`SELECT * FROM "Usuarios"`;
  return rows;
}

async function getUsuarioById(id) {
  const rows = await sql`SELECT * FROM "Usuarios" WHERE id_usuario = ${id}`;
  return rows[0];
}

async function getUsuariosIdNombre() {
  return await sql`SELECT id_usuario, nombre FROM "Usuarios"`;
}

async function createUsuario(data) {
  const requiredFields = ["nombre", "apellido_paterno", "fecha_nacimiento", "usuario", "correo", "telefono", "contrasena", "rol"];
  
  for (const field of requiredFields) {
    if (!data[field]) throw new Error(`El campo ${field} es obligatorio`);
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const result = await sql`
    INSERT INTO "Usuarios" 
    (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, usuario, correo, telefono, contrasena, rol) 
    VALUES (
      ${data.nombre}, 
      ${data.apellido_paterno}, 
      ${data.apellido_materno || null}, 
      ${data.fecha_nacimiento}, 
      ${data.usuario}, 
      ${data.correo}, 
      ${data.telefono}, 
      ${hashedPassword},
      ${data.rol}
    ) 
    RETURNING id_usuario
  `;

  return result[0].id_usuario;
}

async function updateUsuario(id, data) {
  const hashedPassword =
    data.contrasena && data.contrasena.trim() !== ""
      ? await bcrypt.hash(data.contrasena, 10)
      : null;

  const result = await sql`
    UPDATE "Usuarios" SET
      nombre = ${data.nombre},
      ...,
      rol = ${data.rol} 
    WHERE id_usuario = ${id}
    RETURNING id_usuario
  `;
  return result.length > 0;
}

async function deleteUsuario(id) {
  const result = await sql`
    DELETE FROM "Usuarios" WHERE id_usuario = ${id}
    RETURNING id_usuario
  `;
  return result.length > 0;
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getUsuariosIdNombre,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
