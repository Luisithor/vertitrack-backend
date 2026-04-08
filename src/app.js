require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const clientesRoutes = require('./routes/clientes.routes');
app.use('/api/clientes', clientesRoutes);

const elevadoresRoutes = require('./routes/elevador.routes');
app.use('/api/elevadores', elevadoresRoutes);

const fallaRoutes = require('./routes/falla.routes');
app.use('/api/fallas', fallaRoutes);

const historialRoutes = require('./routes/historial.routes');
app.use('/api/historial', historialRoutes);

const ordenRoutes = require('./routes/orden.routes');
app.use('/api/ordenes', ordenRoutes);

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

const mantenimientoRoutes = require('./routes/mantenimiento.routes');
app.use('/api/mantenimientos', mantenimientoRoutes);

app.get('/', (req, res) => {
  res.send('Backend vertitrack activo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
