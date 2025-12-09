const { sequelize } = require('./config/database');
const Product = require('./models/productModel');

async function checkAllProducts() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Obtener todos los productos
        const products = await Product.findAll();
        console.log('Productos en la base de datos:');
        products.forEach(product => {
            console.log(`ID: ${product.id}, Nombre: ${product.name}, Código de barras: ${product.barcode}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAllProducts();