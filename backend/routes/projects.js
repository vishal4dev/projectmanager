const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Create project (Admin only)
router.post('/', auth, roleCheck(['Admin']), async (req, res) => {
  const { name, description, members } = req.body;
  try {
    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: members || [],
    });
    await project.save();

    // Add project to owner's projects
    await User.findByIdAndUpdate(req.user.id, { $push: { projects: project._id } });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate('owner members');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
