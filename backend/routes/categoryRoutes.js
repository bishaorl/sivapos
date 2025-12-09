const express = require('express')
const router = express.Router()
const { addCategory, getCategories, updateCategory, removeCategory } = require('../controllers/categoryController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/add-category', verifyToken, addCategory)
// Removemos la verificación de token para obtener categorías
router.get('/get-categories', getCategories)
router.put('/update-category/:categoryId', verifyToken, updateCategory)
router.delete('/remove-category/:categoryId', verifyToken, removeCategory)

module.exports = router