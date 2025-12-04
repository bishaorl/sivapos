const express = require('express')
const dotenv = require('dotenv').config({ path: './.env' })
console.log('JWT_KEY en server:', process.env.JWT_KEY)
const { connectDatabase } = require('./config/database')
const { errorHandler} = require('./middleware/errorMiddleware')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const settingRoutes = require('./routes/settingRoutes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// DATABASE CONNECT
connectDatabase()

const app = express()

const corsOrigin = {
    origin: [
        'http://localhost:3000',
        'https://react-pos-management-system.vercel.app',
        'https://react-pos-management-system-qmcf.vercel.app',
    ], 
    credentials:true,            
}
app.use(cors(corsOrigin))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))

// ROUTES
app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/setting', settingRoutes)

// Middleware
app.use(errorHandler)

// SERVER SETUP
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server on port ${PORT}`))