const { sequelize } = require('./config/database');
const Product = require('./models/productModel');
const User = require('./models/userModel');

async function createTestProduct() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Verificar si existe un usuario, si no, crear uno
        let user = await User.findOne();
        if (!user) {
            console.log('Creando usuario de prueba...');
            user = await User.create({
                name: 'Usuario de prueba',
                email: 'test@example.com',
                password: 'password123',
                isAdmin: true
            });
            console.log('Usuario de prueba creado:', user.id);
        } else {
            console.log('Usando usuario existente:', user.id);
        }
        
        // Crear un producto de prueba con el código de barras
        const testProduct = await Product.create({
            name: 'Producto de prueba',
            price: 10.99,
            stock: 50,
            category: 'Prueba',
            barcode: '2BCWH0173Z525I',
            userId: user.id
        });
        
        console.log('Producto de prueba creado:');
        console.log(testProduct.toJSON());
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestProduct();