const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const courseAssignmentController = require("../controller/course_assignment.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 등록된 강의목록 출력
router.get("/", isAuth, courseAssignmentController.getCourseAssignmentInfo);
router.post(
  "/",
  isAuth,
  isProfessor,
  courseAssignmentController.makeCourseAssignment
);

router.post(
  "/:id",
  isAuth,
  isProfessor,
  courseAssignmentController.updateCourseAssignment
);
router.delete(
  "/:id",
  isAuth,
  isProfessor,
  courseAssignmentController.deleteCourseAssignment
);

module.exports = router;
