const { body } = require("express-validator");

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = loginValidation;
