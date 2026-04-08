const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario.controller');

router.get('/lista', usuarioCtrl.getUsuarios);
router.get('/consulta/:id', usuarioCtrl.getUsuarioById);
router.get('/listado-simple', usuarioCtrl.listarUsuariosIdNombre);
router.post('/crear', usuarioCtrl.createUsuario);
router.put('/actualizar/:id', usuarioCtrl.updateUsuario);
router.post('/cambiar-rol', usuarioCtrl.solicitudCambioRol);
router.delete('/eliminar/:id', usuarioCtrl.deleteUsuario);

module.exports = router;