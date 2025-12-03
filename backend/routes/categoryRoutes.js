const express = require('express')
const router = express.Router()
const { addCategory, getCategories, updateCategory, removeCategory } = require('../controllers/categoryController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/add-category', verifyToken, addCategory)
router.get('/get-categories', verifyToken, getCategories)
router.put('/update-category/:categoryId', verifyToken, updateCategory)
router.delete('/remove-category/:categoryId', verifyToken, removeCategory)

module.exports = router