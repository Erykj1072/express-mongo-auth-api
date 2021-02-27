require("dotenv/config");
require("../services/passport");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { registerValidation, loginValidation } = require("../validation");



//GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    //Create and json JWT token
    const token = jwt.sign({ _id: req.user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({ message: "Successfuly Signed In!" });
  }
);

//FACEBOOK OAUTH
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    //Create and json JWT token
    const token = jwt.sign({ _id: req.user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({ message: "Successfuly Signed In!" });
  }
);

// LOCAL AUTHENTICATION
//REGISTER
router.post("/register", async (req, res) => {
  //Validate details
  const { error } = registerValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  //Store req.body data
  const { username, email, password } = req.body;

  //Check if email exists
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(401).json("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    //Return user object id
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //Validate details
  const { error } = loginValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  //Store req.body data
  const { email, password } = req.body;

  //Check if email exists
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json("Invalid Email");

  //Check if password is correct
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(401).json("Invalid Password");

  //Create and json JWT token
  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET);

  newRefreshToken = new RefreshToken({
    token: refreshToken
  })

  try{
    newRefreshToken.save()
    res.json({accessToken: accessToken, refreshToken: refreshToken});
  }catch(err){
    console.log(err.message)
  }
 
});

router.post("/forgot", async (req, res) => {
  const resetPasswordToken = await crypto.randomBytes(32).toString("hex");
  const { email } = req.body;
  try {
    await User.findOneAndUpdate(
      { email },
      {
        $set: { resetPasswordToken, resetPasswordExpires: Date.now() + 900000 },
      },
      { useFindAndModify: false }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_SECRET,
      },
    });

    const mailOptions = {
      from: "someemail@gmail.com",
      to: email,
      subject: "Password Reset",
      text:
        "To reset your password follow this link, if you didnt request a password reset ignore this email " +
        `http://localhost:4000/reset/${resetPasswordToken}\n\n`,
    };

    await transporter.jsonMail(mailOptions);
    res.status(200).json({ message: "Email Sent" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/reset", async (req, res) => {
  //Hash password
  const { resetPasswordToken, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await User.findOneAndUpdate(
      { resetPasswordToken },
      { $set: { password: hashedPassword } },
      { useFindAndModify: false }
    );
    res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/token", (req, res) => {
  const {refreshToken} = req.body
  if (!refreshToken) return res.status(401).json("No Token");
  try {
    RefreshToken.findOne({ token: refreshToken }, (err, doc) => {
      if(doc === null) return res.status(401).json("Token Not Found");
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(401).json("Token Invalid");
        const newAccessToken = jwt.sign({ _id : user._id}, process.env.TOKEN_SECRET, {
          expiresIn: "15m",
        });
        res.json({ accessToken: newAccessToken });
      });
    });
  } catch (err) {
    res.status(401).json("Oops something went wrong!");
  }
})

router.delete("/logout", async(req, res) => {
  const refreshToken = req.body.refreshToken
  try{
    await RefreshToken.deleteOne({token: refreshToken})
    res.status(200).json("Token Removed")
  }catch(err){
    res.status(401).json({ message: err.message });
  }
})

module.exports = router;
