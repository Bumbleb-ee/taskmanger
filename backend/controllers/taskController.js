const Task = require("../models/Task");

/*
========================
CREATE TASK
POST /api/tasks
========================
*/
const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
};


/*
========================
GET USER TASKS (FILTER + PAGINATION)
GET /api/tasks
========================
*/
const getTasks = async (req, res) => {
  const { status, priority, search, sort, page = 1, limit = 10 } = req.query;

  let query = { user: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  let sortOption = { createdAt: -1 };
  if (sort === "dueDate") sortOption = { dueDate: 1 };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const total = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  res.json({
    tasks,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    total,
  });
};


/*
========================
UPDATE TASK
PUT /api/tasks/:id
========================
*/
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.priority = req.body.priority ?? task.priority;
  task.status = req.body.status ?? task.status;

  const updatedTask = await task.save();
  res.json(updatedTask);
};


/*
========================
DELETE TASK
DELETE /api/tasks/:id
========================
*/
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne();

  res.json({ message: "Task removed" });
};


/*
========================
GET TASK STATS
GET /api/tasks/stats
========================
*/
const getTaskStats = async (req, res) => {
  const userId = req.user._id;

  const total = await Task.countDocuments({ user: userId });

  const completed = await Task.countDocuments({
    user: userId,
    status: "completed",
  });

  const pending = await Task.countDocuments({
    user: userId,
    status: "pending",
  });

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  res.json({
    total,
    completed,
    pending,
    completionRate,
  });
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
};