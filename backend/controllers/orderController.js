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
    const orders = await Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 100
    });
    res.status(200).json(orders);
}

// @route   /api/order/delete
// @desc    Delete Order
const removeOrder = async (req, res) => {
    const { order: orderId } = req.params;

    const order = await Order.findByPk(orderId)

    if (!order) {
        res.status(404)
        throw new Error('Order not found')
    }

    if (order.userId !== req.user.id) {
        if (!req.user.isAdmin) {
            res.status(401)
            throw new Error('A user can only delete the order they created')
        }
    }

    await order.destroy()
    res.status(200).json({ id: orderId })
}

module.exports = {
    addOrder,
    getOrders,
    removeOrder
}
