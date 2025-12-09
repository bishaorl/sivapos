const { sequelize } = require('./config/database');
const Category = require('./models/categoryModel');

async function createTestCategories() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Crear categorías de prueba
        const categories = [
            { category: 'Electrónica', image: '' },
            { category: 'Ropa', image: '' },
            { category: 'Alimentos', image: '' },
            { category: 'Hogar', image: '' }
        ];
        
        for (const catData of categories) {
            const existingCategory = await Category.findOne({ where: { category: catData.category } });
            if (!existingCategory) {
                const category = await Category.create(catData);
                console.log('Categoría creada:', category.category);
            } else {
                console.log('Categoría ya existe:', catData.category);
            }
        }
        
        // Mostrar todas las categorías
        const allCategories = await Category.findAll();
        console.log('Todas las categorías:');
        allCategories.forEach(cat => {
            console.log(`- ${cat.category}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestCategories();