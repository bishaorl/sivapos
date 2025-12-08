const { sequelize } = require('./config/database');

async function checkDatabase() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Verificar la estructura de la tabla Products
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('Products');
        
        console.log('Estructura de la tabla Products:');
        console.log(tableInfo);
        
        // Verificar específicamente si existe la columna barcode
        if (tableInfo.barcode) {
            console.log('\n✓ La columna barcode existe en la tabla Products');
        } else {
            console.log('\n✗ La columna barcode NO existe en la tabla Products');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verificando la base de datos:', error);
        process.exit(1);
    }
}

checkDatabase();