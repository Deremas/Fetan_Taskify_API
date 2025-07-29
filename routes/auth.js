const router = require("express").Router();
const { signup, login } = require("../controllers/authController");
const signupValidation = require("../middlewares/signUpMiddleware");
const loginValidation = require("../middlewares/loginMiddleWare");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;
