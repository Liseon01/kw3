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

    if (!user) return res.status(401).json(AUTH_ERROR);

    req.user_id = user.user_id; // req.customData
    next();
  });
};

const isStudent = async (req, res, next) => {
  const user_id = req.user_id;
  const user_info = await model.user
    .findOne({ where: { user_id: user_id } })
    .catch((err) => {
      console.log(err);
      console.log("Sever Error. isStudent");
      return res.status(500).json({ message: "Server Error" });
    });
  if (!user_info) {
    console.log("유저 정보를 찾을 수 없습니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
  if (user_info.role === "student") next();
  else {
    console.log("사용자가 학생이 아닙니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
};

const isProfessor = async (req, res, next) => {
  const user_id = req.user_id;
  const user_info = await model.user
    .findOne({ where: { user_id: user_id } })
    .catch((err) => {
      console.log(err);
      console.log("Sever Error. isStudent");
      return res.status(500).json({ message: "Server Error" });
    });
  if (!user_info) {
    console.log("유저 정보를 찾을 수 없습니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
  if (user_info.role === "professor") next();
  else {
    console.log("사용자가 교수가 아닙니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
};

module.exports = { isAuth, isStudent, isProfessor };
