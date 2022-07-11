const express = require("express");
const Item = require("../models/Item");
const router = express.Router();
const mongoose = require("mongoose");
//CREATE
router.post("/", async (req, res) => {
  const { userId, title, body, stock, price, photo, diet, type } = req.body;

  //Create new order object
  const item = new Item({
    userId,
    title,
    body,
    stock,
    price,
    photo,
    diet,
    type,
  });

  try {
    //Save item object to collection
    await item.save();

    //Return item success message
    res.status(200).json({ message: "success" });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//GET ALL
router.get("/", async (req, res) => {
  try {
    //Get all items with that date
    const allItems = await Item.find();

    //Return Item success message and items
    res.status(200).json({ allItems });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//GET BY ID
router.get("/:id", async (req, res) => {
  const filter = req.params.id;

  try {
    //Get item by ID
    const item = await Item.findById(filter);

    //Return order success message and order
    res.status(200).json({ item });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//UPDATE BY ID
router.patch("/id", async (req, res) => {
  const itemId = req.params;

  try {
    //Delete item by ID
    await Order.remove({ _id: itemId });

    //Return item success message
    res.status(200).json({ message: success });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//DELETE BY ID
router.delete("/remove/id", async (req, res) => {
  const itemId = req.params;

  try {
    //Delete item by ID
    await Order.remove({ _id: itemId });

    //Return item success message
    res.status(200).json({ message: success });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
