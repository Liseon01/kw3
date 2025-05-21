const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validator.js");
const registrationController = require("../controller/registration.js");
const { isAuth } = require("../middleware/auth.js");

const router = express.Router();

const validateCredential = [];

// isAuth에서 req.user_id를 넘겨줌
// router.get("/", isAuth, registrationController.getAllRegistrationInfo); // TEST
router.get("/", isAuth, registrationController.getAllRegistrationInfoById);
router.post("/", isAuth, registrationController.courseRegistration);
router.delete("/:id", isAuth, registrationController.courseDropping);

module.exports = router;
