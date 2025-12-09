const { sequelize } = require('./config/database');
const Product = require('./models/productModel');

async function testBarcodeSearch() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Código de barras a buscar
        const barcode = '2BCWH0173Z525I';
        
        // Buscar producto por código de barras
        const product = await Product.findOne({ where: { barcode } });
        
        if (product) {
            console.log('Producto encontrado:');
            console.log('ID:', product.id);
            console.log('Nombre:', product.name);
            console.log('Código de barras:', product.barcode);
            console.log('Todos los datos:', product.toJSON());
        } else {
            console.log(`No se encontró producto con código de barras: ${barcode}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testBarcodeSearch();