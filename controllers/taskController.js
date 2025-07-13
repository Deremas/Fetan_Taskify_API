const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  const { name } = req.body;
  const task = await prisma.task.create({
    data: { name, userId: req.user.id },
  });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      name: { contains: search },
    },
    skip: (page - 1) * limit,
    take: parseInt(limit),
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.task.count({
    where: { userId: req.user.id, name: { contains: search } },
  });

  res.json({ total, tasks });
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { status },
  });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Task deleted" });
};
