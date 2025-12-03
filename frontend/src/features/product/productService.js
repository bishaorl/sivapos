import httpRequest from '../../utils/request'

const API_URL = '/product'

// Get user products
const getProducts = async () => {
    const response = await httpRequest.get(API_URL + '/all-products')
    return response.data
}

// Create new product
const productCreate = async (productData) => {
    const response = await httpRequest.post(API_URL + '/add-product', productData)
    return response.data
}

// Delete product
const removeProduct = async (productId) => {
    const response = await httpRequest.delete(`${API_URL}/delete/${productId}`)
    return response.data
}

// Edit product
const editProduct = async (prod) => {
    const response = await httpRequest.put(`${API_URL}/update-product/${prod.product.id}`, prod.product)
    return response.data
}

// Get product by category
const categoryProductFilter = async (category) => {
    const response = await httpRequest.get(API_URL + '/product-filter/' + category)
    return response.data
}

// Update product
const updateProduct = async (productId, productData) => {
    const response = await httpRequest.put(API_URL + '/update-product/' + productId, productData)
    return response.data
}

const productService = {
    getProducts,
    productCreate,
    removeProduct,
    editProduct,
    categoryProductFilter,
    updateProduct,
}

export default productService
