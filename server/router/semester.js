const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const semesterController = require("../controller/semester.js");
const { isAuth, isStudent } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 모든 학기정보 주기
router.get("/", isAuth, semesterController.getALLSemesterInfo);

module.exports = router;
