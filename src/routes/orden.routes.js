const express = require("express");
const router = express.Router();
const ordenController = require("../controllers/orden.controller");

router.get("/lista", ordenController.getOrdenes);
router.post("/crear", ordenController.createOrden);
router.put("/actualizar/:id", ordenController.updateOrden);
router.delete("/eliminar/:id", ordenController.deleteOrden);

module.exports = router;