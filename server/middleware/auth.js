const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const model = require("../models");

const AUTH_ERROR = { message: "Authentication Error" };

const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await model.user
      .findOne({ where: { user_id: decoded.id } }) // findOne은 객체로 반환
      .catch((err) => console.log(err));

    if (Object.keys(user).length === 0 && user.constructor === Object) {
      return res.status(401).json(AUTH_ERROR);
    }

    req.user_id = user.user_id; // req.customData
    next();
  });
};

module.exports = { isAuth };
