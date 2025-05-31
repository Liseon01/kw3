const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models");
const config = require("../configs/config");

async function login(req, res) {
  const { id_num, password } = req.body;
  const user = await model.user // 리턴값 Object
    .findOne({ where: { id_num: id_num } })
    .catch((err) => console.log(err));

  if (!user)
    return res.status(401).json({ message: "Invalid user or password" });

  const isValidPassword = await bcrypt.compare(password, user.password_hashed);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid password" }); // TEST 문구 바꾸기
  }
  const token = createJwtToken(user.user_id);
  res.status(200).json({ token, id_num });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// req.user_id가 잘 동작하는지 확인하기 위함
async function me(req, res, next) {
  const user = await model.user
    .findOne({ where: { user_id: req.user_id } })
    .catch((err) => console.log(err));
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ token: req.token, id_num: user.id_num });
}

module.exports = { login, me };
