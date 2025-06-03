const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models");
const config = require("../configs/config");

async function signup(req, res) {
  const { password, identity_num, name, gender, phone_number, email, role } =
    req.body;
  const password_hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const identity_num_hashed = await bcrypt.hash(
    identity_num,
    config.bcrypt.saltRounds
  );
  const data = {
    password_hashed,
    identity_num_hashed,
    name,
    gender,
    phone_number,
    email,
    last_login_date: new Date(),
    role,
    is_active_verified: 0,
  };
  try {
    await model.user.create(data);
    res.status(201).json({ message: "회원가입 신청이 완료되었습니다." });
  } catch (err) {
    console.log(err);
    console.log("회원가입 신청이 실패하였습니다.");
    res.status(500).json({ message: "회원가입 신청이 실패하였습니다." });
  }
}

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

module.exports = { signup, login, me };
