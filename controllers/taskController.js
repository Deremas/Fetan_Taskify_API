const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTask = async (req, res) => {
console.log("User info:", req.user);
  const { task_name } = req.body;
  console.log(req.body);
  const task = await prisma.task.create({
    data: { task_name, userId: req.user.id },
  });
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      task_name: { contains: search },
    },
    skip: (page - 1) * limit,
    take: parseInt(limit),
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.task.count({
    where: { userId: req.user.id, task_name: { contains: search } },
  });

  res.json({ total, tasks });
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { status },
  });
  res.json(task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Task deleted" });
};

// Exporting the functions
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};