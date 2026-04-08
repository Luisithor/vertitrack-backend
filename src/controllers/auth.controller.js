const sql = require('../config/db'); // Cambiamos pool por sql (nuestro archivo db.js con Neon)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const rows = await sql`SELECT * FROM "Usuarios" WHERE usuario = ${usuario}`;
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const nombreUsuario = `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno || ''}`.trim();

    res.json({ 
      message: 'Autenticación exitosa', 
      token, 
      rol: user.rol, 
      id_usuario: user.id_usuario,
      nombre: nombreUsuario 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};