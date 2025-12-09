const Product = require('../models/productModel');

// @route   /api/product/all-products
// @desc    All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll()
        res.status(201).json(products)
    } catch (error) {
        console.error('Error en getAllProducts:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/product/add-product
// @desc    Add Product
const addProduct = async (req, res) => {
    try {
        const { name, stock, image, price, category, barcode } = req.body
        
        if (!name || !stock || !price || !category ) {
            return res.status(400).json({ message: 'Por favor complete los espacios en blanco' })
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
    } catch (error) {
        console.error('Error en addProduct:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/product/delete/:product
// @desc    Delete Product
const removeProduct = async (req, res) => {
    try {
        const { product: productId } = req.params;

        const product = await Product.findByPk(productId)

        if (!product) {
            return res.status(400).json({ message: 'Producto no encontrado' })
        }

        if (product.userId !== req.user.id) {
            return res.status(401).json({ message: 'A user can only delete the product they added' })
        }

        await product.destroy()
        res.status(201).json(product)
    } catch (error) {
        console.error('Error en removeProduct:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/product/update-product/:id
// @desc    Update Product
const updateProduct = async (req, res) => {
    try {
        console.log('req.body:', req.body)
        console.log('req.params:', req.params)
        const { name, stock, image, price, category, barcode } = req.body
        const { id } = req.params
        console.log('id:', id)

        // Verificar que el producto exista
        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        // Verificar si el producto pertenece al usuario
        if (product.userId !== req.user.id) {
            return res.status(401).json({ message: 'Un usuario solo puede actualizar el producto que agregó.' })
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
    } catch (error) {
        console.error('Error en updateProduct:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/product/product-filter
// @desc    Filter Product
const categoryProductFilter = async (req, res) => {
    try {
        const { category } = req.params
        const filterProduct = await Product.findAll({ where: { category } })
        res.status(201).json(filterProduct)
    } catch (error) {
        console.error('Error en categoryProductFilter:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/product/search-by-barcode/:barcode
// @desc    Search Product by Barcode
const searchByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params
        console.log('Parámetro de código de barras recibido:', barcode);
        
        if (!barcode) {
            console.log('Código de barras vacío o no proporcionado');
            return res.status(400).json({ message: 'Código de barras es requerido' })
        }

        console.log('Buscando producto con código de barras:', barcode);
        const product = await Product.findOne({ where: { barcode } })
        console.log('Resultado de la búsqueda:', product ? 'Producto encontrado' : 'Producto no encontrado');
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.status(200).json(product)
    } catch (error) {
        console.error('Error en searchByBarcode:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    categoryProductFilter,
    searchByBarcode,
    removeProduct
}