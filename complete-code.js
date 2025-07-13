// =======================================
// ✅ FINAL REFINED BACKEND STRUCTURE — STEP BY STEP
// Express.js + Prisma + MySQL (MAMP)
// =======================================

// ------------------------------
// STEP 1: Project Initialization
// ------------------------------
// Run these commands:
// mkdir fetan_task_api && cd fetan_task_api
// npm init -y
// npm install express prisma @prisma/client cors bcryptjs jsonwebtoken dotenv
// npx prisma init

// ------------------------------
// STEP 2: Setup .env File
// ------------------------------
// .env
DATABASE_URL="mysql://fetan_task:fetan_task@localhost:3306/fetan_task"
JWT_SECRET="your_jwt_secret"

// ------------------------------
// STEP 3: Prisma Schema
// ------------------------------
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  name     String
  email    String   @unique
  password String
  tasks    Task[]
  createdAt DateTime @default(now())
}

model Task {
  id        Int        @id @default(autoincrement())
  name      String
  status    TaskStatus @default(PENDING)
  userId    Int
  user      User       @relation(fields: [userId], references: [id])
  createdAt DateTime   @default(now())
}

enum TaskStatus {
  PENDING
  COMPLETED
  ACTIVE
  INACTIVE
}

// Run:
// npx prisma db push
// npx prisma generate

// ------------------------------
// STEP 4: Create Folder Structure
// ------------------------------
/*
fetan_task_api/
├── prisma/
├── db/
│   └── index.js
├── models/
│   ├── user.js
│   └── task.js
├── controllers/
│   ├── authController.js
│   ├── profileController.js
│   └── taskController.js
├── routes/
│   ├── auth.js
│   ├── profile.js
│   └── tasks.js
├── middleware/
│   └── auth.js
├── utils/
│   └── jwt.js
├── .env
├── server.js
*/

// ------------------------------
// STEP 5: Create Prisma DB Export
// ------------------------------
// db/index.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;

// ------------------------------
// STEP 6: User Model Abstraction
// ------------------------------
// models/user.js
const prisma = require("../db");

exports.findByEmail = (email) => prisma.user.findUnique({ where: { email } });
exports.createUser = (data) => prisma.user.create({ data });

// ------------------------------
// STEP 7: Task Model Abstraction
// ------------------------------
// models/task.js
const prisma = require("../db");

exports.createTask = (data) => prisma.task.create({ data });
exports.getUserTasks = (userId, page = 1, search = "") =>
  prisma.task.findMany({
    where: { userId, name: { contains: search } },
    skip: (page - 1) * 10,
    take: 10,
    orderBy: { createdAt: "desc" },
  });
exports.countUserTasks = (userId, search = "") =>
  prisma.task.count({ where: { userId, name: { contains: search } } });
exports.updateTask = (id, status) =>
  prisma.task.update({ where: { id: Number(id) }, data: { status } });
exports.deleteTask = (id) =>
  prisma.task.delete({ where: { id: Number(id) } });

// ------------------------------
// STEP 8: Auth Middleware
// ------------------------------
// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ------------------------------
// STEP 9: Auth Controller
// ------------------------------
// controllers/authController.js
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const userModel = require("../models/user");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await userModel.findByEmail(email);
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);
  await userModel.createUser({ name, email, password: hash });
  res.status(201).json({ message: "User created" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user.id });
  res.json({ token });
};

// ------------------------------
// STEP 10: Profile Controller
// ------------------------------
// controllers/profileController.js
const prisma = require("../db");

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { name: true, email: true },
  });
  res.json(user);
};

// ------------------------------
// STEP 11: Task Controller
// ------------------------------
// controllers/taskController.js
const taskModel = require("../models/task");

exports.createTask = async (req, res) => {
  const task = await taskModel.createTask({ name: req.body.name, userId: req.user.id });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { page = 1, search = "" } = req.query;
  const tasks = await taskModel.getUserTasks(req.user.id, page, search);
  const total = await taskModel.countUserTasks(req.user.id, search);
  res.json({ total, tasks });
};

exports.updateTask = async (req, res) => {
  const task = await taskModel.updateTask(req.params.id, req.body.status);
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await taskModel.deleteTask(req.params.id);
  res.json({ message: "Task deleted" });
};

// ------------------------------
// STEP 12: Auth Routes
// ------------------------------
// routes/auth.js
const router = require("express").Router();
const { signup, login } = require("../controllers/authController");
router.post("/signup", signup);
router.post("/login", login);
module.exports = router;

// ------------------------------
// STEP 13: Profile Route
// ------------------------------
// routes/profile.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const { getProfile } = require("../controllers/profileController");
router.get("/", auth, getProfile);
module.exports = router;

// ------------------------------
// STEP 14: Task Routes
// ------------------------------
// routes/tasks.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.patch("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;

// ------------------------------
// STEP 15: JWT Utility
// ------------------------------
// utils/jwt.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ------------------------------
// STEP 16: Server Entry Point
// ------------------------------
// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
