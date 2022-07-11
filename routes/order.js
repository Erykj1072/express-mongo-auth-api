require("dotenv/config");
const express = require("express");
const Order = require("../models/Order");
const Item = require("../models/Item");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const router = express.Router();
var mongoose = require("mongoose");
//CREATE
router.post("/", async (req, res) => {
  const { businessId, userId, items, destination, status, type } = req.body;

  const order = new Order({
    businessId,
    userId,
    items,
    destination,
    status,
    type,
  });

  const idExtract = items.map((item) => item._id);
  const orderItems = await Item.find({ _id: { $in: idExtract } });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        const orderItem = orderItems.find((x) => x._id == item._id);
        console.log(orderItem);
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: orderItem.title,
            },
            unit_amount: orderItem.price,
          },
          quantity: item.qty,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/successful-checkout.html`,
      cancel_url: `${process.env.CLIENT_URL}/canceled-checkout.html`,
    });
    //Save order object to collection
    await order.save();
    //Return order checkout session
    res.status(200).json({ url: session.url });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//GET ALL BY USER ID
router.get("/findByBusiness/:id", async (req, res) => {
  const businessId = req.params.id;
  console.log(userId);
  try {
    //Get all orders with that date
    const allOrders = await Order.find({
      businessId: mongoose.Types.ObjectId(businessId),
    });
    //Return order success message and orders
    res.status(200).json({ allOrders });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

// GET BY ID
router.get("/findByUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    //Get order by ID
    const order = await Order.find({ userId: mongoose.Types.ObjectId(userId) });

    //Return order success message and order
    res.status(200).json({ order });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//DELETE BY ID
router.delete("/removeOne/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    //Delete order by ID
    await Order.remove({ _id: mongoose.Types.ObjectId(orderId) });

    //Return order success message
    res.status(200).json({ message: "success" });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
