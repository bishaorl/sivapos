const { sequelize } = require('./config/database');
const Product = require('./models/productModel');

async function updateDatabase() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Agregar la columna barcode si no existe
        const queryInterface = sequelize.getQueryInterface();
        
        // Verificar si la columna barcode ya existe
        const tableInfo = await queryInterface.describeTable('Products');
        if (!tableInfo.barcode) {
            console.log('Agregando columna barcode a la tabla Products...');
            await queryInterface.addColumn('Products', 'barcode', {
                type: sequelize.Sequelize.STRING,
                allowNull: true
            });
            console.log('Columna barcode agregada exitosamente.');
        } else {
            console.log('La columna barcode ya existe en la tabla Products.');
        }

        console.log('¡Base de datos actualizada exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('Error actualizando la base de datos:', error);
        process.exit(1);
    }
}

updateDatabase();