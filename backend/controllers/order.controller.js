const Order = require('../models/orderSchema.model');

const createOrder = async (req, res) => {

  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data.' });
    }

    const existingOrder = await Order.findOne({ userId, status: { $in: ['Processing', 'Pending'] } });

    if (existingOrder) {
      existingOrder.items = [...existingOrder.items, ...items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        amount: item.amount,
      }))];

      const updatedOrder = await existingOrder.save();

      res.status(200).json({ message: 'Items added to existing order', order: updatedOrder });
    } else {
      const order = new Order({
        userId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          amount: item.amount,
        })),
          status: 'Pending',
      });

      const savedOrder = await order.save();

      res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    }

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrders = async (req, res) => {
  try {
      const userId = req.user.userId;
    const orders = await Order.find({ userId }).populate('items.productId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    console.log("Fetched orders", orders);

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createOrder, getOrders };
