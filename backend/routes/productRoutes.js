const express = require('express')
const router = express.Router()
const { getAllProducts, addProduct, updateProduct, categoryProductFilter, searchByBarcode, removeProduct } = require('../controllers/productController')
const { verifyToken } = require('../middleware/authMiddleware')

router.get('/all-products', verifyToken, getAllProducts)
router.get('/product-filter/:category', verifyToken, categoryProductFilter)
router.get('/search-by-barcode/:barcode', verifyToken, searchByBarcode)
router.post('/add-product', verifyToken, addProduct)
router.put('/update-product/:id', verifyToken, updateProduct)
router.delete('/delete/:product', verifyToken, removeProduct)

module.exports = router