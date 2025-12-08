const { sequelize } = require('./config/database');

async function listTables() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Obtener todas las tablas en la base de datos
        const queryInterface = sequelize.getQueryInterface();
        const tables = await queryInterface.showAllSchemas();
        
        console.log('Tablas en la base de datos:');
        console.log(tables);
        
        // También intentar obtener información de todas las tablas
        const tableNames = await sequelize.getQueryInterface().showAllTables();
        console.log('\nNombres de tablas:');
        console.log(tableNames);
        
        process.exit(0);
    } catch (error) {
        console.error('Error listando tablas:', error);
        process.exit(1);
    }
}

listTables();