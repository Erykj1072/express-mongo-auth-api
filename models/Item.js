const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  stock: {
    type: String,
  },
  // Store in pence
  price: {
    type: String,
  },
  photo: {
    type: String,
    default: "item.png",
  },
  // ex Vegeterian/Vegan
  diet: {
    type: String,
  },
  // ex Food/Drink
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Items", ItemSchema);
