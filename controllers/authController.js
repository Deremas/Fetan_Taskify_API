const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

const signup = async (req, res) => {
  // Handle validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req, res) => {

  // Handle validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({message: "login successfully" , token });
};

module.exports = { signup, login };