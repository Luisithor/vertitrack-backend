const express = require("express");
const router = express.Router();
const mantenimientoController = require("../controllers/mantenimiento.controller");

router.get("/lista", mantenimientoController.getAllMantenimientos);
router.get("/historial/:id_elevador", mantenimientoController.listarPorElevador);
router.get("/:id", mantenimientoController.getById);
router.post("/crear", mantenimientoController.crear);
router.put("/actualizar/:id", mantenimientoController.actualizar);
router.delete("/eliminar/:id", mantenimientoController.eliminar);

module.exports = router;