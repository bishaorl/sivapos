const { connectDatabase } = require('./config/database')
const User = require('./models/userModel')
const bcrypt = require('bcryptjs')

const createAdminUser = async () => {
    try {
        await connectDatabase()

        const adminExists = await User.findOne({ where: { email: 'orlnodaminer@gmail.com' } })
        if (adminExists) {
            console.log('El usuario administrador ya existe.')
            return
        }

        const hashPassword = bcrypt.hashSync('123456', 8)

        const adminUser = await User.create({
            name: 'Orlando Noda',
            email: 'orlnodaminer@gmail.com',
            password: hashPassword,
            isAdmin: true
        })

        console.log('Usuario administrador creado exitosamente:', adminUser.toJSON())
    } catch (error) {
        console.error('Error al crear usuario administrador:', error.message)
    } finally {
        process.exit(0)
    }
}

createAdminUser()
