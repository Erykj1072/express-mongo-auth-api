const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

  const token = req.body.accessToken

  //Check if token empty
  if (!token) return res.status(401).json("Access Denied");

  try 
  {
    //Verify token
    const verifed = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = verifed;

    next();

  } 
  catch(err) 
  {

    //Return error message
    res.status(401).json("Invalid Token");

  }
}
