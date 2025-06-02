const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const assignmentController = require("../controller/assignment.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

const validateCredential = [];

// 과제 리스트 조회 -> 학생
router.get(
  "/student/list/:id",
  isAuth,
  isStudent,
  assignmentController.getAllAssignmentListById
);

// 과제 조회 -> 학생
router.get(
  "/student/view/:id",
  isAuth,
  isStudent,
  assignmentController.getOneAssignmentById
);

// 과제 리스트 조회 -> 교수
router.get(
  "/professor/list/:id",
  isAuth,
  isProfessor,
  assignmentController.getAllAssignmentListById
);

// 과제 조회 -> 교수
router.get(
  "/professor/view/:id",
  isAuth,
  isProfessor,
  assignmentController.getOneAssignmentById
);

// 과제 작성 -> 교수
router.post(
  "/professor",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "assignments";
    next();
  },
  upload.array("files", 5),
  assignmentController.makeAssignment
);

// 과제 업데이트 -> 교수
router.put(
  "/professor/:id",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "assignments";
    next();
  },
  upload.array("files", 5),
  assignmentController.updateAssignment
);

// 과제 삭제 -> 교수
router.delete(
  "/professor/:id",
  isAuth,
  isProfessor,
  assignmentController.deleteAssignment
);

module.exports = router;
