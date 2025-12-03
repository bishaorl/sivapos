const Category = require('../models/categoryModel');
// @route   /api/category/add-category
// @desc    Add Category
const addCategory = async (req, res) => {
    const { category, image } = req.body

    if (!category) {
        res.status(400)
        throw new Error('Please add a category and image')
    }

    const categories = await Category.create({
        category,
        image
    })

    res.status(201).json(categories)
}

// @route   /api/category/get-categories
// @desc    Get Categories
const getCategories = async (req, res) => {
    const categories = await Category.findAll()
   res.status(200).json(categories)
}

// @route   /api/category/remove-category/:categoryId
// @desc    Remove Category
const removeCategory = async (req, res) => {
    const { categoryId } = req.params;

    console.log('Removing category with ID:', categoryId);

    // Try to find by ID first
    let category = await Category.findByPk(categoryId);
    
    // If not found and categoryId might be in a different format, try alternative approaches
    if (!category) {
        // Try to find by id field (in case of different ID format)
        category = await Category.findOne({ where: { id: categoryId } });
    }

    if (!category) {
        res.status(400);
        throw new Error(`Category not found with ID: ${categoryId}`);
    }

    await category.destroy();
    res.status(201).json(category);
}

// @route   /api/category/update-category/:categoryId
// @desc    Update Category
const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { category, image } = req.body;

    console.log('Updating category with ID:', categoryId);
    console.log('Request body:', req.body);

    if (!category) {
        res.status(400);
        throw new Error('Please add a category and image');
    }

    // Try to find by ID first
    let categoryToUpdate = await Category.findByPk(categoryId);
    
    // If not found and categoryId might be in a different format, try alternative approaches
    if (!categoryToUpdate) {
        // Try to find by id field (in case of different ID format)
        categoryToUpdate = await Category.findOne({ where: { id: categoryId } });
    }

    if (!categoryToUpdate) {
        res.status(400);
        throw new Error(`Category not found with ID: ${categoryId}`);
    }

    const updatedCategory = await categoryToUpdate.update({
        category,
        image
    });

    res.status(201).json(updatedCategory);
}

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    removeCategory
}
