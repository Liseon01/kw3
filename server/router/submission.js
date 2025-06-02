const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const submissionController = require("../controller/submission.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

const validateCredential = [];

// 과제제출 리스트 조회 -> 학생
router.get(
  "/student/list/:id",
  isAuth,
  isStudent,
  submissionController.getAllSubmissionListByIdForStudent
);
// 과제제출 리스트 조회 -> 교수
router.get(
  "/professor/list/:id",
  isAuth,
  isProfessor,
  submissionController.getAllSubmissionListByIdForProfessor
);

// 과제제출 조회 -> 학생
router.get(
  "/student/view/:id",
  isAuth,
  isStudent,
  submissionController.getOneSubmissionByIdForStudent
);
// 과제제출 조회 -> 교수
router.get(
  "/professor/view/:id",
  isAuth,
  isProfessor,
  submissionController.getOneSubmissionByIdForProfessor
);

// 과제제출 작성 -> 학생
router.post(
  "/student",
  isAuth,
  isStudent,
  (req, res, next) => {
    req.folder_name = "submissions";
    next();
  },
  upload.array("files", 5),
  submissionController.makeSubmission
);

// 과제 성적 부여  -> 교수
router.put(
  "/professor/:id",
  isAuth,
  isProfessor,
  submissionController.assignSubmissionGrade
);

// 과제제출 수정 -> 학생
router.put(
  "/student/:id",
  isAuth,
  isStudent,
  (req, res, next) => {
    req.folder_name = "submissions";
    next();
  },
  upload.array("files", 5),
  submissionController.updateSubmission
);

// 과제제출 삭제 -> 학생
router.delete(
  "/student/:id",
  isAuth,
  isStudent,
  submissionController.deleteSubmission
);

module.exports = router;
