const mongoose = require('mongoose');
const { connectDatabase, sequelize } = require('./config/database');
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

// Definir esquemas de Mongoose para MongoDB (asumiendo estructuras similares)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    image: String,
    category: String
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    stock: Number,
    category: String,
    barcode: String,
    userId: String
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    customer: String,
    country: String,
    province: String,
    zipcode: Number,
    phone: Number,
    cartItems: Array,
    subTotal: Number,
    totalAmount: Number,
    tax: Number,
    payment: String,
    userId: String
}, { timestamps: true });

// const mongoUri = process.argv[2];
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('Por favor proporciona la URI de MongoDB como argumento.');
    process.exit(1);
}

async function migrate() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(mongoUri);
        console.log('Conectado a MongoDB');

        // Conectar a SQLite
        await connectDatabase();

        // Obtener modelos de Mongoose
        const MongoUser = mongoose.model('User', UserSchema);
        const MongoCategory = mongoose.model('Category', CategorySchema);
        const MongoProduct = mongoose.model('Product', ProductSchema);
        const MongoOrder = mongoose.model('Order', OrderSchema);

        // Migrar Users
        const users = await MongoUser.find({});
        for (const user of users) {
            await User.create({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                password: user.password,
                isAdmin: user.isAdmin || false,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        }
        console.log(`Migrados ${users.length} usuarios`);

        // Migrar Categories
        const categories = await MongoCategory.find({});
        for (const category of categories) {
            await Category.create({
                id: category._id.toString(),
                image: category.image,
                category: category.category,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            });
        }
        console.log(`Migradas ${categories.length} categorías`);

        // Migrar Products
        const products = await MongoProduct.find({});
        for (const product of products) {
            await Product.create({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                category: product.category,
                barcode: product.barcode || null,
                userId: product.userId,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            });
        }
        console.log(`Migrados ${products.length} productos`);

        // Migrar Orders
        const orders = await MongoOrder.find({});
        for (const order of orders) {
            await Order.create({
                id: order._id.toString(),
                customer: order.customer,
                country: order.country,
                province: order.province,
                zipcode: order.zipcode,
                phone: order.phone,
                cartItems: order.cartItems,
                subTotal: order.subTotal,
                totalAmount: order.totalAmount,
                tax: order.tax,
                payment: order.payment,
                userId: order.userId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            });
        }
        console.log(`Migradas ${orders.length} órdenes`);

        console.log('¡Migración completada!');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
}

migrate();