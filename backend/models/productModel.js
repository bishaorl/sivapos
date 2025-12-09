const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true, // Hacer opcional para búsquedas públicas
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    // Usar force: false para evitar recrear la tabla y perder datos
    sync: { force: false }
})

// Sincronizar el modelo con la base de datos sin forzar cambios
Product.sync()
    .then(() => {
        console.log('Tabla Products sincronizada correctamente');
    })
    .catch((error) => {
        console.error('Error sincronizando tabla Products:', error);
    });

module.exports = Product