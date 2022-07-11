const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  items: [
    {
      itemId: {
        type: mongoose.Types.ObjectId,
      },
      qty: {
        type: String,
      },
    },
  ],
  deliveryDestination: {
    type: String,
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
  payment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Orders", OrderSchema);
