const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'shhhhh';

function validarToken(req, res, next) {
  const rutasPublicas = ['/', '/api/auth/login', '/api/usuarios/crear', '/api/reset-password/request-reset', 
    '/api/reset-password/reset', '/api/mascotas/lista', '/api/ai/recomendar-raza'];

  if (rutasPublicas.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
}

module.exports = validarToken;
