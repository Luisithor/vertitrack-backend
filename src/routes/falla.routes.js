const express = require("express");
const router = express.Router();
const fallaController = require("../controllers/falla.controller");

router.get("/lista", fallaController.getFallas);
router.get("/:id", fallaController.getFallaById);
router.post("/crear", fallaController.createFalla);
router.put("/actualizar/:id", fallaController.updateFalla);
router.delete("/eliminar/:id", fallaController.deleteFalla);

module.exports = router;