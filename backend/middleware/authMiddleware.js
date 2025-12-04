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

// Protect middleware
const protect = async (req, res, next) => {
    const token = req.cookies.accessToken
    
    if (token) {
        try {
            const { id } = verifyJWT(token)
            req.user = await User.findByPk(id, { attributes: { exclude: ['password'] } })
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' })
            }
            
            next()
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' })
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }
}

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' })
    }
}

module.exports = { verifyToken, protect, admin }