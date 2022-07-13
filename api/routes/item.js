const express = require("express");
const Item = require("../models/Item");
const router = express.Router();
const mongoose = require("mongoose");
//CREATE
router.post("/createByBusiness", async (req, res) => {
  const { businessId, title, body, stock, price, photo, diet, type } = req.body;

  //Create new order object
  const item = new Item({
    businessId,
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
router.get("/getAllByBusiness/:id", async (req, res) => {
  const businessId = req.params.id;
  try {
    //Get all items with that date
    const allItems = await Item.find({
      businessId: mongoose.Types.ObjectId(businessId),
    });

    //Return Item success message and items
    res.status(200).json({ allItems });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//GET BY ID
router.get("/getOneByBusiness/:businessId/:itemId", async (req, res) => {
  const { businessId, itemId } = req.params;
  console.log(businessId, itemId);
  try {
    //Get item by ID
    const item = await Item.find({
      businessId: mongoose.Types.ObjectId(businessId),
      _id: mongoose.Types.ObjectId(itemId),
    });

    //Return order success message and order
    res.status(200).json({ item });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//UPDATE BY ID
router.patch("/updateByBusiness/:businessId/:itemId", async (req, res) => {
  const { businessId, itemId } = req.params;
  const content = req.body;

  try {
    //Delete item by ID
    await Item.findOneAndUpdate(
      {
        businessId: mongoose.Types.ObjectId(businessId),
        _id: mongoose.Types.ObjectId(itemId),
      },
      content
    );

    //Return item success message
    res.status(200).json({ message: "success" });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

//DELETE BY ID
router.delete("/removeByBusiness/:businessId/:itemId", async (req, res) => {
  const { businessId, itemId } = req.params;

  try {
    //Delete item by ID
    await Item.remove({
      businessId: mongoose.Types.ObjectId(businessId),
      _id: mongoose.Types.ObjectId(itemId),
    });

    //Return item success message
    res.status(200).json({ message: "success" });
  } catch (err) {
    //Return error message
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
