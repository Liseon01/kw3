const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const syllabusController = require("../controller/syllabus.js");
const { isAuth, isStudent, isProfessor } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// GET 강의계획서 조회
router.get("/:id", isAuth, syllabusController.getSyllabusInfo);

// POST 강의계획서 작성 -> 교수
router.post("/professor", isAuth, isProfessor, syllabusController.makeSyllabus);

// PUT 강의계획서 수정 -> 교수
router.put(
  "/professor/:id",
  isAuth,
  isProfessor,
  syllabusController.updateSyllabus
);

// DELETE 강의계획서 삭제 -> 교수
router.delete(
  "/professor/:id",
  isAuth,
  isProfessor,
  syllabusController.deleteSyllabus
);
module.exports = router;
