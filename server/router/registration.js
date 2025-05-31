const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const registrationController = require("../controller/registration.js");
const { isAuth, isStudent } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

router.get(
  "/",
  isAuth,
  isStudent,
  registrationController.getAllRegistrationInfoById
);
router.get(
  "/schedule/:id",
  isAuth,
  isStudent,
  registrationController.getAllScheduleById
);
router.post("/", isAuth, isStudent, registrationController.courseRegistration);
router.delete("/:id", isAuth, isStudent, registrationController.courseDropping);

module.exports = router;
