const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Setting = sequelize.define('Setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rif: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    dir: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    impuesto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tasa_imp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false // La tabla Setting no tiene timestamps
})

module.exports = Setting