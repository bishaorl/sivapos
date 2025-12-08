const Product = require('../models/productModel');

// @route   /api/product/all-products
// @desc    All Products
const getAllProducts = async (req, res) => {
    const products = await Product.findAll()
    res.status(201).json(products)
}

// @route   /api/product/add-product
// @desc    Add Product
const addProduct = async (req, res) => {

    const { name, stock, image, price, category, barcode } = req.body
    
    if (!name || !stock || !price || !category ) {
        res.status(400)
        throw new Error('Por favor complete los espacios en blanco')  
    }

    const product = await Product.create({
        name,
        stock,
        image,
        price,
        category,
        barcode,
        userId: req.user.id
    })

    res.status(201).json(product)  
}

// @route   /api/product/update-product/:id
// @desc    Update Product
const updateProduct = async (req, res) => {
    console.log('req.body:', req.body)
    console.log('req.params:', req.params)
    const { name, stock, image, price, category, barcode } = req.body
    const { id } = req.params
    console.log('id:', id)

    // Verificar que el producto exista
    const product = await Product.findByPk(id)
    if (!product) {
        res.status(404)
        throw new Error('Producto no encontrado')
    }

    // Verificar si el producto pertenece al usuario
    if (product.userId !== req.user.id) {
        res.status(401)
        throw new Error('Un usuario solo puede actualizar el producto que agregó.')
    }

    // Actualizar el producto
    const updatedProduct = await product.update({
        name,
        stock,
        image,
        price,
        category,
        barcode
    })
    
    console.log('updated product:', updatedProduct)

    res.status(200).json(updatedProduct)
}

// @route   /api/product/product-filter
// @desc    Filter Product
const categoryProductFilter = async (req, res) => {
    const { category } = req.params
    const filterProduct = await Product.findAll({ where: { category } })
    res.status(201).json(filterProduct)
}

// @route   /api/product/search-by-barcode/:barcode
// @desc    Search Product by Barcode
const searchByBarcode = async (req, res) => {
    const { barcode } = req.params
    
    if (!barcode) {
        res.status(400)
        throw new Error('Código de barras es requerido')
    }

    const product = await Product.findOne({ where: { barcode } })
    
    if (!product) {
        res.status(404)
        throw new Error('Producto no encontrado')
    }

    res.status(200).json(product)
}

const removeProduct = async (req, res) => {

    const { product: productId } = req.params;

    const product = await Product.findByPk(productId)

    if (!product) {
            res.status(400)
            throw new Error('Please fill in the blanks')
    }

     if (product.userId !== req.user.id) {
        res.status(401)
        throw new Error('A user can only delete the product they added')
    }

    await product.destroy()
    res.status(201).json(product)
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    categoryProductFilter,
    searchByBarcode,
    removeProduct
}