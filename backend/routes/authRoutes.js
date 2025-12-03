const express = require('express')
const router = express.Router()
const { userRegister, userLogin, getAllUsers, logout, updateUser, removeUser } = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/users', verifyToken, getAllUsers)
router.post('/logout', logout)
router.put('/update-user/:userId', verifyToken, updateUser)
router.delete('/remove-user/:userId', verifyToken, removeUser)

module.exports = router