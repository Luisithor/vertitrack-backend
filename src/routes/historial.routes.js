const express = require("express");
const router = express.Router();
const historialController = require("../controllers/historial.controller");

router.get("/lista", historialController.getHistorial);
router.post("/crear", historialController.createHistorial);

module.exports = router;