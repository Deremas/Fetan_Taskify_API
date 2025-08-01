const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.patch("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
