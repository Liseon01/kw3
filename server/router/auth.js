const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const authController = require("../controller/auth.js");
const { isAuth } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [
  body("id_num")
    .trim()
    .notEmpty()
    .withMessage("id_num should be at least 10 characters"),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("password should be at least 3 characters"),
  validate,
];

router.post("/signup", authController.signup);

router.post("/login", validateCredential, authController.login);

router.get("/me", isAuth, authController.me); // req.user_id가 잘 전달되는지 확인하기 위함

module.exports = router;
