const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description, project, assignedTo, dueDate } = req.body;
  try {
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    if (
      proj.owner.toString() !== req.user.id &&
      !proj.members.includes(req.user.id) &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });
    await task.save();

    // Add task to project
    await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const proj = task.project;
    if (
      proj.owner.toString() !== req.user.id &&
      !proj.members.includes(req.user.id) &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const proj = task.project;
    if (proj.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    // Remove from project
    await Project.findByIdAndUpdate(proj._id, { $pull: { tasks: req.params.id } });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
