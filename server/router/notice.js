const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const noticeController = require("../controller/notice.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

const validateCredential = [];

// 공지사항 리스트 조회 -> 학생
router.get(
  "/student/list/:id",
  isAuth,
  isStudent,
  noticeController.getAllNoticeListById
);

// 공지사항 조회 -> 학생
router.get(
  "/student/view/:id",
  isAuth,
  isStudent,
  noticeController.getOneNoticeById
);

// 공지사항 리스트 조회 -> 교수
router.get(
  "/professor/list/:id",
  isAuth,
  isProfessor,
  noticeController.getAllNoticeListById
);

// 공지사항 조회 -> 교수
router.get(
  "/professor/view/:id",
  isAuth,
  isProfessor,
  noticeController.getOneNoticeById
);

// 공지사항 작성 -> 교수
router.post(
  "/professor",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "notices";
    next();
  },
  upload.array("files", 5),
  noticeController.makeNotice
);

// 공지사항 업데이트 -> 교수
router.put(
  "/professor/:id",
  isAuth,
  isProfessor,
  (req, res, next) => {
    req.folder_name = "notices";
    next();
  },
  upload.array("files", 5),
  noticeController.updateNotice
);

// 공지사항 삭제 -> 교수
router.delete(
  "/professor/:id",
  isAuth,
  isProfessor,
  noticeController.deleteNotice
);

module.exports = router;
