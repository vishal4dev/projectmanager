import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await api.get('/api/projects', config);
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects');
      }
    };
    fetchProjects();
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await api.post('/api/projects', form, config);
      setForm({ name: '', description: '' });
      setSuccess('Project created successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Only Admins can create projects');
      } else {
        setError(err.response?.data?.message || 'Failed to create project');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Projects
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
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button type="submit" variant="contained" fullWidth>
              Create Project
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3}>
        {projects.map((proj) => (
          <Grid item xs={12} sm={6} md={4} key={proj._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {proj.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {proj.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/tasks/${proj._id}`)}>
                  View Tasks
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
