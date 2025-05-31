const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const gradeController = require("../controller/grade.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 모든 성적 불러오기 -> 학생
router.get("/", isAuth, isStudent, gradeController.getAllGradeById);

// GET 강의하는 과목의 학생 성적 불러오기 -> 교수
router.get(
  "/assign/:id",
  isAuth,
  isProfessor,
  gradeController.getStudentGradeByCourseAssignmentId
);

// POST 학생성적에 성적 입력 -> 교수
router.post(
  "/assign/:id",
  isAuth,
  isProfessor,
  gradeController.assignGradeToStudent
);

module.exports = router;
