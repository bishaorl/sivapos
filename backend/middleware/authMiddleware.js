const User = require('../models/userModel')
const { verifyJWT } = require('../utils/jwt')

const verifyToken = async (req, res, next) => {
    const token = req.cookies.accessToken
    console.log('Verifying token:', token);
    
    if (token) {
        try {
            const { id } = verifyJWT(token)
            console.log('Decoded user ID:', id);
            req.user = await User.findByPk(id, { attributes: { exclude: ['password'] } })
            console.log('User found:', req.user);
            
            if (!req.user) {
                return res.status(404).send("User not found")
            }
            
            next()
        } catch (error) {
            console.log('Token verification error:', error)
            return res.status(404).send("Not auth")
        }
    } else {
            return res.status(404).send("Not token")
    }
}

module.exports = { verifyToken }