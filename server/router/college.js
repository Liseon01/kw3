const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const collegeController = require("../controller/college.js");
const { isAuth, isStudent } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 모든 대학정보 주기
router.get("/", isAuth, collegeController.getALLCollegeInfo);
router.get(
  "/:college_id/departments",
  isAuth,
  collegeController.getDepartmentInfoByCollegeId
);

module.exports = router;
