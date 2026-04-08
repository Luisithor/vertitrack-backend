const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");

router.get("/lista", clientesController.getClientes);
router.get("/:id", clientesController.getClienteById);
router.post("/crear", clientesController.createCliente);
router.put("/actualizar/:id", clientesController.updateCliente);
router.delete("/eliminar/:id", clientesController.deleteCliente);

module.exports = router;