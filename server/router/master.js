const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const masterController = require("../controller/master.js");
const { isAuth, isMaster } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", isAuth, isMaster, masterController.getAllSignUpRequestList);

router.post(
  "/student",
  isAuth,
  isMaster,
  masterController.permitStudentSignUpRequest
);
router.post(
  "/professor",
  isAuth,
  isMaster,
  masterController.permitProfessorSignUpRequest
);

router.delete("/:id", isAuth, isMaster, masterController.deleteSignUpRequest);

module.exports = router;
