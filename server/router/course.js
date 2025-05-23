const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const courseController = require("../controller/course.js");
const { isAuth, isStudent } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 강의 목록 검색해서 출력
router.get("/search", isAuth, isStudent, courseController.getCourseInfo);

module.exports = router;
