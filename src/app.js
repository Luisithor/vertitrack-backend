require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

const app = express();

try {
  const serviceAccount = require(
    path.join(__dirname, "..", "vertitrack-service-account.json"),
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🔥 Firebase Admin inicializado correctamente");
} catch (error) {
  console.error("❌ Error al inicializar Firebase Admin:", error.message);
}

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- RUTAS ---
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clientes", require("./routes/clientes.routes"));
app.use("/api/elevadores", require("./routes/elevador.routes"));
app.use("/api/fallas", require("./routes/falla.routes"));
app.use("/api/historial", require("./routes/historial.routes"));
app.use("/api/ordenes", require("./routes/orden.routes"));
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/mantenimientos", require("./routes/mantenimiento.routes"));

// --- ENDPOINT DE SALUD (Health Check) ---
// Útil para que Render sepa que el servicio está vivo
app.get("/", async (req, res) => {
  res.send(`Vertitrack Backend Online 🚀`);
});

// --- MANEJO DE ERRORES GLOBAL ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
});
