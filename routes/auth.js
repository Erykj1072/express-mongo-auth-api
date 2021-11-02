require("dotenv/config");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//REGISTER
router.post("/register", async (req, res) => {

  const { username, email, password } = req.body;

  //Check if email exists
  const emailExists = await User.findOne({ email });

  if (emailExists) return res.status(401).json("Email already exists");
  
  //Hash password
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  //Create new user object
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try 
  {

    //Save user object to collection
    const savedUser = await user.save();

    //Return user object id
    res.status(200).json({ user: user._id });

  } 
  catch(err) 
  {

    //Return error message
    res.status(401).json({ message: err.message });

  }

});

//LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  //Check if email exists
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json("Invalid Email");

  //Check if password is correct
  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) return res.status(401).json("Invalid Password");

  //Create JWT tokens
  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {expiresIn: "15m"});

  const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET);

  //Create a new refresh token object
  newRefreshToken = new RefreshToken({
    token: refreshToken
  })

  try
  {

    //Save refresh token object to collection
    newRefreshToken.save()

    //Return access and refresh tokens
    res.json({accessToken: accessToken, refreshToken: refreshToken});

  }
  catch(err)
  {

    //Return error message
    res.status(401).json({ message: err.message });

  }
 
});

//FORGOT PASSWORD
router.post("/forgot", async (req, res) => {

  //Create reset token
  const resetPasswordToken = await crypto.randomBytes(32).toString("hex");

  const { email } = req.body;

  try 
  {

    //Update user object with token
    await User.findOneAndUpdate(
      { 
        email 
      },
      {
        $set: { resetPasswordToken, resetPasswordExpires: Date.now() + 900000 },
      },
      { 
        useFindAndModify: false 
      }
    );
    
    //Nodemailer transport config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_SECRET,
      },
    });

    //Email sent to users requesting a password reset
    const mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Password Reset",
      text:
        "To reset your password follow this link, if you didnt request a password reset ignore this email " +
        `http://localhost:4000/reset/${resetPasswordToken}\n\n`,
    };

    //Send reset email
    await transporter.jsonMail(mailOptions);

    //Return success message
    res.status(200).json({ message: "Email Sent" });

  } 
  catch(err) 
  {

    //Return error message
    res.status(401).json({ message: err.message });

  }
});

//RESET PASSWORD
router.post("/reset", async (req, res) => {

  const { resetPasswordToken, password } = req.body;

  //Salt and hash password
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  //Update object with new password
  try 
  {
    //Update new password in database
    await User.findOneAndUpdate(
      { resetPasswordToken },
      { $set: { password: hashedPassword } },
      { useFindAndModify: false }
    );

    //Return success message
    res.status(200).json({ message: "Password Updated" });

  } 
  catch(err) 
  {

    res.status(401).json({ message: err.message });

  }
});

//REFRESH ACCESS TOKEN
router.post("/token", (req, res) => {

  const {refreshToken} = req.body

  //Check if refresh token empty
  if (!refreshToken) return res.status(401).json("No Token");

  try 
  {

    //Check if refresh token exists
    RefreshToken.findOne({ token: refreshToken }, (err, doc) => {

      //Return error if not found
      if(doc === null) return res.status(401).json("Token Not Found");

      //Verify refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        //Return error if token isn't valid
        if(err) return res.status(401).json("Token Invalid");

        //Create new access token
        const newAccessToken = jwt.sign({ _id : user._id}, process.env.TOKEN_SECRET, {
          expiresIn: "15m",
        });

        //Return new access token
        res.json({ accessToken: newAccessToken });

      });

    });

  } 
  catch(err) 
  {

    //Return error message
    res.status(401).json("Oops something went wrong!");

  }

})

//LOGOUT
router.delete("/logout", async(req, res) => {

  const refreshToken = req.body.refreshToken

  try
  {

    //Delete refresh token from collection
    await RefreshToken.deleteOne({token: refreshToken})

    //Return success message
    res.status(200).json("Token Removed")

  }
  catch(err)
  {

    res.status(401).json({ message: err.message });

  }

})

module.exports = router;
