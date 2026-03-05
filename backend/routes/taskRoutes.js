const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// stats route
router.get("/stats", protect, getTaskStats);

// CRUD routes
router.route("/")
  .post(protect, createTask)
  .get(protect, getTasks);

router.route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;