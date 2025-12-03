const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
})

const connectDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('SQLite connected')
        await sequelize.sync()
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = { connectDatabase, sequelize }
