require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const private = require("./routes/private")

//MIDDLEWARES

//cors allows for cross domain api requests
app.use(cors());
//express.json parses req.body to json
app.use(express.json());
// app.use(express.urlencoded({extended: false}))

app.use(passport.initialize());
app.use(passport.session());

//IMPORTING ROUTES
const authRoute = require("./routes/auth");

app.use("/api/auth", authRoute);


//ROUTES
app.get("/", (req, res) => {
  res.json("Welcome to auth API");
});

app.get("/protected", private, (req, res) => {
  const user = req.user._id
  res.json("Welcome to protected route user: " + user);
});

// DB CONNECTION
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB CONNECTED")
);

const SERVER_PORT = process.env.PORT || 4000


app.listen(SERVER_PORT, () => console.log(`SERVER RUNNING ON PORT ${SERVER_PORT}`));
