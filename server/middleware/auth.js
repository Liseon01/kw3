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
  const student_info = await model.student
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
  if (!student_info) {
    console.log("학생 정보를 찾을 수 없습니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
  req.student_id = student_info.student_id;
  next();
};

const isProfessor = async (req, res, next) => {
  const user_id = req.user_id;
  const professor_info = await model.professor
    .findOne({
      where: { user_id: user_id },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
  if (!professor_info) {
    console.log("교수 정보를 찾을 수 없습니다. function: isStudent");
    return res.status(401).json({ message: "Invalid Access" });
  }
  req.professor_id = professor_info.professor_id;
  next();
};

const isMaster = async (req, res, next) => {
  const user_id = req.user_id;
  const is_master = await model.user
    .findOne({ where: { user_id: user_id } })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
  if (!is_master) {
    console.log("관리자 정보를 찾을 수 없습니다. function: isMaster");
    return res.status(401).json({ message: "Invalid Access" });
  }
  next();
};

module.exports = { isAuth, isStudent, isProfessor, isMaster };
