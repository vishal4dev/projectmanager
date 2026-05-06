import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const projRes = await api.get('/api/projects', config);
        setProjects(projRes.data);

        const allTasks = [];
        for (const proj of projRes.data) {
          const taskRes = await api.get(
            `/api/tasks/project/${proj._id}`,
            config
          );
          allTasks.push(...taskRes.data);
        }
        setTasks(allTasks);
      } catch (err) {
        setError('Failed to load dashboard data');
      }
    };
    fetchData();
  }, [navigate]);

  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date());

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Projects
              </Typography>
              <List>
                {projects.map((proj) => (
                  <ListItem key={proj._id} button onClick={() => navigate(`/tasks/${proj._id}`)}>
                    <ListItemText primary={proj.name} secondary={proj.description} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                All Tasks
              </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task._id}>
                    <ListItemText primary={task.title} secondary={`Status: ${task.status}`} />
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
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {overdueTasks.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" color="error">
                  Overdue Tasks
                </Typography>
                <List>
                  {overdueTasks.map((task) => (
                    <ListItem key={task._id}>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
