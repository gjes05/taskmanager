import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../services/api';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects(userId);
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleCreateProject = async () => {
    try {
      await createProject({
        ...newProject,
        user: { id: userId }
      });
      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Projects</h1>
        <div style={styles.headerButtons}>
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <button style={styles.button} onClick={handleCreateProject}>Create</button>
        </div>
      )}

      <div style={styles.grid}>
        {projects.length === 0 && (
          <p style={styles.empty}>No projects yet. Create your first one!</p>
        )}
        {projects.map((project) => (
          <div key={project.id} style={styles.card}>
            <h3 style={styles.projectName}>{project.name}</h3>
            <p style={styles.projectDesc}>{project.description}</p>
            <div style={styles.cardButtons}>
              <button
                style={styles.viewButton}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                View Tasks
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
  headerButtons: { display: 'flex', gap: '12px' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' },
  projectName: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a2e' },
  projectDesc: { margin: 0, fontSize: '14px', color: '#666' },
  cardButtons: { display: 'flex', gap: '8px', marginTop: '8px' },
  button: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  viewButton: { padding: '8px 14px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontSize: '13px', cursor: 'pointer', flex: 1 },
  deleteButton: { padding: '8px 14px', borderRadius: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', fontSize: '13px', cursor: 'pointer' },
  logoutButton: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  empty: { color: '#999', gridColumn: '1/-1' }
};

export default Dashboard;