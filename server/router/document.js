const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const documentController = require("../controller/document.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

const validateCredential = [];

// 강의자료실 리스트 조회 -> 학생
router.get(
  "/student/list/:id",
  isAuth,
  isStudent,
  documentController.getAllDocumentListById
);

// 강의자료실 조회 -> 학생
router.get(
  "/student/view/:id",
  isAuth,
  isStudent,
  documentController.getOneDocumentById
);

// 강의자료실 리스트 조회 -> 교수
router.get(
  "/professor/list/:id",
  isAuth,
  isProfessor,
  documentController.getAllDocumentListById
);

// 강의자료실 조회 -> 교수
router.get(
  "/professor/view/:id",
  isAuth,
  isProfessor,
  documentController.getOneDocumentById
);

// 강의자료실 작성 -> 교수
router.post(
  "/professor",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "documents";
    next();
  },
  upload.array("files", 5),
  documentController.makeDocument
);

// 강의자료실 업데이트 -> 교수
router.put(
  "/professor/:id",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "documents";
    next();
  },
  upload.array("files", 5),
  documentController.updateDocument
);

// 강의자료실 삭제 -> 교수
router.delete(
  "/professor/:id",
  isAuth,
  isProfessor,
  documentController.deleteDocument
);

module.exports = router;
