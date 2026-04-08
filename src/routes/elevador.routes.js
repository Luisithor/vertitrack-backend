const express = require("express");
const router = express.Router();
const elevadorController = require("../controllers/elevador.controller");

router.get("/lista", elevadorController.listarElevadoresBasico);
router.get("/", elevadorController.getElevadores);
router.get("/:id", elevadorController.getElevadorById);
router.post("/crear", elevadorController.createElevador);
router.put("/actualizar/:id", elevadorController.updateElevador);
router.get("/cliente/:id_cliente", elevadorController.getElevadoresByCliente);
router.delete("/eliminar/:id", elevadorController.deleteElevador);

module.exports = router;