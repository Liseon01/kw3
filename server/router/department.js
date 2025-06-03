const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const departmentController = require("../controller/department.js");
const { isAuth, isStudent } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 모든 학부정보 주기
router.get("/", isAuth, departmentController.getALLDepartmentInfo);

module.exports = router;
