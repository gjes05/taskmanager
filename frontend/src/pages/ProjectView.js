import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTasksByProject, createTask, updateTask, deleteTask, askAI } from '../services/api';
function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [showAi, setShowAi] = useState(false);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasksByProject(id);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const handleCreateTask = async () => {
    try {
      await createTask({
        ...newTask,
        project: { id },
        user: { id: userId }
      });
      setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };
  const handleAskAI = async (action) => {
  setAiLoading(true);
  setAiResponse('');
  try {
    const taskSummary = tasks.map(t => `${t.title} (${t.status}, ${t.priority})`).join(', ');
    const res = await askAI(action, taskSummary);
    setAiResponse(res.data.response);
  } catch (err) {
    setAiResponse('AI request failed. Please try again.');
  } finally {
    setAiLoading(false);
  }
  
};
  const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
  <div style={styles.pageWrapper}>
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1 style={styles.title}>Project Tasks</h1>
        <div style={styles.headerButtons}>
          <button style={styles.aiToggleButton} onClick={() => setShowAi(!showAi)}>
            🤖 AI Assistant
          </button>
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            style={styles.input}
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <input
            style={styles.input}
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <button style={styles.button} onClick={handleCreateTask}>Create Task</button>
        </div>
      )}

      <div style={styles.kanban}>
        {columns.map((col) => (
          <div key={col} style={styles.column}>
            <h3 style={styles.columnTitle}>{col.replace('_', ' ')}</h3>
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task.id} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  <span style={{
                    ...styles.priority,
                    backgroundColor: task.priority === 'HIGH' ? '#fee2e2' : task.priority === 'MEDIUM' ? '#fef9c3' : '#dcfce7',
                    color: task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#ca8a04' : '#16a34a'
                  }}>
                    {task.priority}
                  </span>
                </div>
                <p style={styles.taskDesc}>{task.description}</p>
                {task.dueDate && <p style={styles.dueDate}>Due: {task.dueDate}</p>}
                <div style={styles.taskButtons}>
                  {col !== 'TODO' && (
                    <button style={styles.moveButton} onClick={() => handleStatusChange(task, columns[columns.indexOf(col) - 1])}>←</button>
                  )}
                  {col !== 'DONE' && (
                    <button style={styles.moveButton} onClick={() => handleStatusChange(task, columns[columns.indexOf(col) + 1])}>→</button>
                  )}
                  <button style={styles.deleteButton} onClick={() => handleDelete(task.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {showAi && (
      <div style={styles.aiPanel}>
        <h3 style={styles.aiTitle}>🤖 AI Assistant</h3>
        <p style={styles.aiSubtitle}>Analyze your current tasks with AI</p>
        <div style={styles.aiButtons}>
          <button style={styles.aiButton} onClick={() => handleAskAI('summarize')}>
            📋 Summarize Tasks
          </button>
          <button style={styles.aiButton} onClick={() => handleAskAI('prioritize')}>
            🎯 What to do first?
          </button>
          <button style={styles.aiButton} onClick={() => handleAskAI('breakdown')}>
            🔨 Breakdown Tasks
          </button>
        </div>
        {aiLoading && <p style={styles.aiLoading}>Thinking...</p>}
        {aiResponse && (
          <div style={styles.aiResponse}>
            <p style={styles.aiResponseText}>{aiResponse}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
}

const styles = {
  container: { flex: 1, minWidth: 0, padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
  backButton: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#e5e7eb', border: 'none', fontSize: '14px', cursor: 'pointer' },
  button: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  kanban: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  column: { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', minHeight: '400px' },
  columnTitle: { margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' },
  taskCard: { backgroundColor: 'white', borderRadius: '10px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  taskTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  taskDesc: { margin: 0, fontSize: '13px', color: '#666' },
  dueDate: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  priority: { fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' },
  taskButtons: { display: 'flex', gap: '6px', marginTop: '4px' },
  moveButton: { padding: '4px 10px', borderRadius: '6px', backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', cursor: 'pointer', fontWeight: '700' },
  deleteButton: { padding: '4px 10px', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer', marginLeft: 'auto' },
  pageWrapper: { display: 'flex', gap: '24px', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
headerButtons: { display: 'flex', gap: '12px' },
aiToggleButton: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#7c3aed', color: 'white', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
aiPanel: { width: '300px', flexShrink: 0, backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content', position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '16px' },
aiTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e' },
aiSubtitle: { margin: 0, fontSize: '13px', color: '#666' },
aiButtons: { display: 'flex', flexDirection: 'column', gap: '8px' },
aiButton: { padding: '10px 16px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed', border: '1px solid #e9d5ff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' },
aiLoading: { color: '#7c3aed', fontSize: '14px', fontStyle: 'italic' },
aiResponse: { backgroundColor: '#f5f3ff', borderRadius: '8px', padding: '16px' },
aiResponseText: { margin: 0, fontSize: '14px', color: '#4a4a6a', lineHeight: '1.6' },
};

export default ProjectView;