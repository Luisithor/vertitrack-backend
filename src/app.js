require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless"); // Importamos Neon

const app = express();

const sql = neon(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clientes", require("./routes/clientes.routes"));
app.use("/api/elevadores", require("./routes/elevador.routes"));
app.use("/api/fallas", require("./routes/falla.routes"));
app.use("/api/historial", require("./routes/historial.routes"));
app.use("/api/ordenes", require("./routes/orden.routes"));
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/mantenimientos", require("./routes/mantenimiento.routes"));

app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const version = result[0].version;
    res.send(`Backend vertitrack activo. DB Version: ${version}`);
  } catch (error) {
    res.status(500).send("Error conectando a la base de datos: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
});