const Order = require('../models/orderSchema.model.js');
const stripe = require('stripe')("sk_test_51QUjVGKkKrbP0tjidm87XcKPwtzO7pIQ1K001ewe6h0xqE8uGIAXJ07JO9jjf3tz8gAlEG3TuU1TQrrayLP95EzZ00cmgwRubK");

const createPayment = async (req, res) => {
  const { cart } = req.body;

  try {
    const amount = cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create payment intent" });
  }
};

module.exports = { createPayment };
