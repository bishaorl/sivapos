import httpRequest from '../../utils/request'

const categoryCreate = async (category) => {
    // localhost:5000/api/category/add-category 
    const response = await httpRequest.post("/category/add-category", category)
    return response.data
}

const getCategories = async () => {
    // localhost:5000/api/category/get-categories 
    const response = await httpRequest.get("/category/get-categories")
    return response.data
}

const removeCategory = async (categoryId) => {
    const response = await httpRequest.delete(`/category/remove-category/${categoryId}`)
    return response.data
}

const updateCategory = async (categoryId, categoryData) => {
    const response = await httpRequest.put(`/category/update-category/${categoryId}`, categoryData)
    return response.data
}

const categoryService = {
    categoryCreate,
    getCategories,
    removeCategory,
    updateCategory
}

export default categoryService
