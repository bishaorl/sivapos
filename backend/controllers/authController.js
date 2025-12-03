const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {createJWT} = require('../utils/jwt')
// @route   /api/auth/register
// @desc    Register  User
const userRegister = async (req, res) => {
    const { name, email, password, isAdmin } = req.body

    if (!name || !email) {
        return res.status(400).json({ message: "Campos obligatorios faltantes" })
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
         return res.status(409).json({ message: "El usuario ya existe" })
    }

    const hashPassword = bcrypt.hashSync(password, 8)

    // Create new user
    const user = await User.create({
        name,
        email,
        password: hashPassword,
        isAdmin: isAdmin || false
    })

    if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
    } else {
        res.status(400).json({ message: 'Datos de usuario inválidos' })
    }

}
// @route   /api/auth/login
// @desc    User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" })
        }

        const user = await User.findOne({ where: { email } })

        if (!user) return res.status(401).json({ message: "Usuario no encontrado" })

        // To check a password
        const isCorrect = bcrypt.compareSync(password, user.password)
        if (!isCorrect) return res.status(401).json({ message: "Contraseña incorrecta" })

        const token = createJWT(user.id)
        res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }).status(200).json({
            _id:  user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })

    } catch (e) {
         res.status(500).json({ message: "Error interno del servidor" })
    }
}

// @route   /api/auth/users
// @desc    All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        // Transformar los usuarios para que usen _id en lugar de id para consistencia con el frontend
        const transformedUsers = users.map(user => ({
            ...user.toJSON(),
            _id: user.id
        }))
        res.status(200).json(transformedUsers)
    } catch (e) {
        res.status(500).json({ message: "Error al obtener usuarios" })
    }
}

// @route   /api/auth/logout
// @desc    User Logout
const logout = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out' });
};

// @route   /api/auth/remove-user/:userId
// @desc    Remove User (Admin only)
const removeUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if current user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Solo el administrador puede eliminar usuarios' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Prevent admin from deleting themselves
        if (userId === req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (e) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// @route   /api/auth/update-user/:userId
// @desc    Update User (Admin only)
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password, isAdmin } = req.body;

        console.log('Update user request:', { userId, name, email, password, isAdmin });
        console.log('Current user:', req.user);

        // Check if current user is admin
        if (!req.user.isAdmin) {
            console.log('User is not admin');
            return res.status(403).json({ message: 'Solo el administrador puede actualizar usuarios' });
        }

        const user = await User.findByPk(userId);
        
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Prevent admin from updating themselves to non-admin
        if (userId === req.user.id && !isAdmin) {
            console.log('Admin trying to remove own admin privileges');
            return res.status(400).json({ message: 'No puedes quitarte permisos de administrador a ti mismo' });
        }

        // Prepare update data
        const updateData = {
            name,
            email,
            isAdmin
        };

        // Only update password if provided
        if (password) {
            const hashPassword = bcrypt.hashSync(password, 8);
            updateData.password = hashPassword;
        }

        console.log('Update data:', updateData);
        // Usar el método update de Sequelize correctamente
        const [updatedRowsCount, updatedUsers] = await User.update(updateData, {
            where: { id: userId },
            returning: true // Para obtener el usuario actualizado (solo compatible con PostgreSQL)
        });
        
        // Si returning no es compatible con SQLite, buscar el usuario actualizado
        let updatedUser;
        if (updatedUsers && updatedUsers.length > 0) {
            updatedUser = updatedUsers[0];
        } else {
            updatedUser = await User.findByPk(userId);
        }

        res.status(200).json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } catch (e) {
        console.error('Error updating user:', e);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = {
    userRegister,
    userLogin,
    getAllUsers,
    logout,
    updateUser,
    removeUser
}
