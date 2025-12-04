const express = require('express')
const router = express.Router()
const { getSetting, saveSetting } = require('../controllers/settingController')
const { protect, admin } = require('../middleware/authMiddleware')

// Rutas para la configuración
// Solo los administradores pueden acceder a estas rutas
router.route('/')
    .get(protect, admin, getSetting)
    .post(protect, admin, saveSetting)

module.exports = router