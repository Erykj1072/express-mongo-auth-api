const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //Check if there is a token in header
  const token = req.body.accessToken
  if (!token) return res.status(401).json("Access Denied");
  try {
    //Verify token
    const verifed = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifed;
    next();
  } catch (err) {
    console.log(req.header("auth-token"))
    res.status(401).json("Invalid Token");
  }
}
