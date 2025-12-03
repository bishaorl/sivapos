const Order = require('../models/orderModel')
const Product = require('../models/productModel')
// @route   /api/order/add-order
// @desc    Add Order
const addOrder = async (req, res) => {

    const {
            customer,
            country,
            province,
            zipcode,
            phone,
            cartItems,
            subTotal,
            totalAmount,
            tax,
            payment
    } = req.body

  if (!cartItems || cartItems.length < 1) {
    console.log('No cart items')
    }

    const order = await Order.create({
            customer,
            country,
            province,
            zipcode,
            phone,
            cartItems,
            subTotal,
            totalAmount,
            tax,
            payment,
            userId: req.user.id
    })

    // product stock update
    for (const product of cartItems) {
        await Product.decrement('stock', { by: product.quantity, where: { id: product.id } })
    }

    res.status(201).json(order)
}

// @route   /api/order/get-orders
// @desc    Get Orders
const getOrders = async (req, res) => {
    const orders = await Order.findAll()
    res.status(201).json(orders)
}

// @route   /api/order/delete
// @desc    Delete Order
const removeOrder = async (req, res) => {
    const { order: orderId } = req.params;

    const order = await Order.findByPk(orderId)

    if (!order) {
        res.status(400)
        throw new Error('Please fill in the blanks')
    }

    if (order.userId !== req.user.id) {
        if (!req.user.isAdmin) {
            res.status(401)
            throw new Error('A user can only delete the product they added')
        }
    }

    await order.destroy()
    res.status(201).json(order)
}

module.exports = {
    addOrder,
    getOrders,
    removeOrder
}
