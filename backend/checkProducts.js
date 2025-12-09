const { sequelize } = require('./config/database');
const Product = require('./models/productModel');

async function checkProducts() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Obtener todos los productos
        const products = await Product.findAll();
        console.log('Productos en la base de datos:');
        products.forEach(product => {
            console.log(`ID: ${product.id}, Nombre: ${product.name}, Código de barras: ${product.barcode}`);
        });
        
        // Buscar producto específico por código de barras
        const barcode = '2BCWH0173Z525I';
        const product = await Product.findOne({ where: { barcode } });
        if (product) {
            console.log('Producto encontrado:');
            console.log(product.toJSON());
        } else {
            console.log(`No se encontró producto con código de barras: ${barcode}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProducts();