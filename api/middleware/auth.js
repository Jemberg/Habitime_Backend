const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// Checking for authentication.
const auth = async (req, res, next) => {
  try {
    const token = req.headers.auth_token;

    const verification = jwt.verify(token, `${process.env.JWT_SECRET}`);

    if (verification) {
      req.user = await User.findOne({
        _id: verification._id,
        "tokens.token": token,
      });
      req.token = token;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Authentication failed, please log in. " });
  }
};

module.exports = auth;
