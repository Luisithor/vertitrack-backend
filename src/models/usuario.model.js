const pool = require("../config/db");
const bcrypt = require("bcryptjs");

async function getAllUsuarios() {
  const [rows] = await pool.query("SELECT * FROM Usuarios");
  return rows;
}

async function getUsuarioById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM Usuarios WHERE id_usuario = ?",
    [id]
  );
  return rows[0];
}

async function getUsuariosIdNombre() {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre FROM Usuarios"
  );
  return rows;
}

async function createUsuario(data) {
  const requiredFields = [
    "nombre",
    "apellido_paterno",
    "fecha_nacimiento",
    "usuario",
    "correo",
    "telefono",
    "contrasena"
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const query = `
    INSERT INTO Usuarios
    (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, usuario, correo, telefono, contrasena)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    data.nombre,
    data.apellido_paterno,
    data.apellido_materno || null,
    data.fecha_nacimiento,
    data.usuario,
    data.correo,
    data.telefono,
    hashedPassword
  ]);

  return result.insertId;
}

async function updateUsuario(id, data) {

  let query = `
    UPDATE Usuarios SET
      nombre = ?,
      apellido_paterno = ?,
      apellido_materno = ?,
      fecha_nacimiento = ?,
      usuario = ?,
      correo = ?,
      telefono = ?
  `;

  const values = [
    data.nombre,
    data.apellido_paterno,
    data.apellido_materno || null,
    data.fecha_nacimiento,
    data.usuario,
    data.correo,
    data.telefono
  ];

  if (data.contrasena && data.contrasena.trim() !== "") {
    const hashedPassword = await bcrypt.hash(data.contrasena, 10);
    query += `, contrasena = ?`;
    values.push(hashedPassword);
  }

  query += ` WHERE id_usuario = ?`;
  values.push(id);

  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
}

async function deleteUsuario(id) {
  const query = "DELETE FROM Usuarios WHERE id_usuario = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getUsuariosIdNombre,
  createUsuario,
  updateUsuario,
  deleteUsuario
};