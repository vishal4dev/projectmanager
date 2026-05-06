import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, config);
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/tasks', { ...form, project: projectId }, config);
      setForm({ title: '', description: '', dueDate: '' });
      setSuccess('Task created successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, config);
      window.location.reload();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks for Project
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button type="submit" variant="contained" fullWidth>
              Create Task
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography variant="body2">
                  Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                </Typography>
                {task.dueDate && (
                  <Typography variant="body2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={task.status}
                    label="Status"
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
                <Chip
                  label={task.status}
                  color={
                    task.status === 'Done'
                      ? 'success'
                      : task.status === 'In Progress'
                        ? 'warning'
                        : 'default'
                  }
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Tasks;
