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
    try {
        const categories = await Category.findAll()
        res.status(200).json(categories)
    } catch (error) {
        console.error('Error en getCategories:', error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

// @route   /api/category/remove-category/:categoryId
// @desc    Remove Category
const removeCategory = async (req, res) => {
    try {
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
            return res.status(400).json({ message: `Category not found with ID: ${categoryId}` });
        }

        await category.destroy();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error en removeCategory:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// @route   /api/category/update-category/:categoryId
// @desc    Update Category
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { category, image } = req.body;

        console.log('Updating category with ID:', categoryId);
        console.log('Request body:', req.body);

        if (!category) {
            return res.status(400).json({ message: 'Please add a category and image' });
        }

        // Try to find by ID first
        let categoryToUpdate = await Category.findByPk(categoryId);
        
        // If not found and categoryId might be in a different format, try alternative approaches
        if (!categoryToUpdate) {
            // Try to find by id field (in case of different ID format)
            categoryToUpdate = await Category.findOne({ where: { id: categoryId } });
        }

        if (!categoryToUpdate) {
            return res.status(400).json({ message: `Category not found with ID: ${categoryId}` });
        }

        const updatedCategory = await categoryToUpdate.update({
            category,
            image
        });

        res.status(201).json(updatedCategory);
    } catch (error) {
        console.error('Error en updateCategory:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    removeCategory
}
