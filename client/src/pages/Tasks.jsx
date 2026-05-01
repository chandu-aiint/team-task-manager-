import React, { useState, useEffect } from 'react';
import { ListTodo, Plus, X, Loader2, Shield, Send, Trash2 } from 'lucide-react';
import { taskAPI, projectAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['Todo', 'In Progress', 'Done'];

// ─── Task Assignment Modal ─────────────────────────────────────────────────
export const TaskAssignmentModal = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [taskEntries, setTaskEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenProjects') || '[]');
      projectAPI.getAll().then(res => {
        setProjects(res.data.filter(p => !hiddenIds.includes(String(p._id))));
      }).catch(console.error);
      userAPI.getAll().then(res => setUsers(res.data)).catch(console.error);
      setStep(1); setSelectedProject(null);
    }
  }, [isOpen]);

  const handleProjectSelect = (id) => {
    setSelectedProject(projects.find(p => p._id === id));
    setStep(2);
  };

  const handleQuantityConfirm = () => {
    setTaskEntries(Array.from({ length: quantity }, () => ({
      title: '', assignedTo: '', status: 'Todo', project: selectedProject._id
    })));
    setStep(3);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...taskEntries];
    updated[index][field] = value;
    setTaskEntries(updated);
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    for (let i = 0; i < taskEntries.length; i++) {
      if (!taskEntries[i].title) return toast.error(`Enter a title for Task ${i + 1}`);
      if (!taskEntries[i].assignedTo) return toast.error(`Select a member for Task ${i + 1}`);
    }
    setLoading(true);
    try {
      const payloads = taskEntries.map(t => {
        const manualMember = selectedProject?.members?.find(m => String(m.user) === String(t.assignedTo));
        const foundUser = users.find(u => String(u._id) === String(t.assignedTo));
        const name = manualMember?.name || foundUser?.name || 'Unknown';
        return { ...t, assignedToName: name };
      });
      await Promise.all(payloads.map(t => taskAPI.create(t)));
      toast.success(`${quantity} Task(s) Assigned!`);
      onCreated?.();
      onClose();
    } catch { toast.error('Failed to assign tasks'); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-3xl bg-white rounded-[40px] shadow-2xl relative z-10 p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Step 1: Select Project</h2>
            {projects.length === 0 && <p className="text-slate-400 text-sm">No projects found. Create one first.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p._id} onClick={() => handleProjectSelect(p._id)}
                  className="p-6 border border-slate-100 rounded-3xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.members?.length || 0} team members · {p.progress || 0}% done</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && selectedProject && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl">
                {selectedProject.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedProject.members?.length || 0} members</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">How many tasks to assign?</label>
              <div className="flex items-center gap-4">
                <input type="number" min="1" max="20" className="pro-input w-32 text-center text-xl font-bold"
                  value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                <button onClick={handleQuantityConfirm} className="btn-premium flex-1 !py-4">
                  Continue → Define {quantity} Tasks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmitBatch} className="space-y-8" noValidate>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ListTodo size={24} className="text-primary" /> Assign Tasks
            </h2>
            <div className="space-y-4">
              {taskEntries.map((entry, i) => (
                <div key={i} className="p-6 border border-slate-100 rounded-[24px] bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="pro-input bg-white" placeholder={`Task ${i + 1} title`}
                    value={entry.title} onChange={e => updateEntry(i, 'title', e.target.value)} />
                  <select className="pro-input bg-white" value={entry.assignedTo}
                    onChange={e => updateEntry(i, 'assignedTo', e.target.value)}>
                    <option value="">Select Team Member</option>
                    {selectedProject?.members?.length > 0
                      ? selectedProject.members.map((m, idx) => (
                        <option key={idx} value={m.user}>{m.name} ({m.role})</option>
                      ))
                      : <option disabled>⚠️ No members in this project</option>
                    }
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="pro-input !py-4 !bg-slate-100 font-semibold text-slate-600">
                Back
              </button>
              <button type="submit" disabled={loading} className="btn-premium flex-1 !py-4 text-lg flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Confirm Assignments</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Tasks Page ────────────────────────────────────────────────────────────
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hiddenTaskIds, setHiddenTaskIds] = useState(() => JSON.parse(localStorage.getItem('hiddenTasks') || '[]'));
  const { user } = useAuth();

  useEffect(() => { fetchTasks(); }, [hiddenTaskIds]);

  const fetchTasks = () => {
    taskAPI.getAll().then(res => {
      setTasks(res.data.filter(t => !hiddenTaskIds.includes(String(t._id))));
    }).catch(console.error);
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      toast.success('Status updated');
      fetchTasks();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = (id) => {
    const newHidden = [...hiddenTaskIds, String(id)];
    setHiddenTaskIds(newHidden);
    localStorage.setItem('hiddenTasks', JSON.stringify(newHidden));
    toast.success('Task removed');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-slate-500 mt-1">View and manage all assigned tasks.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-premium flex items-center gap-2">
          <Plus size={18} /> Assign Tasks
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">All Assigned Tasks</h3>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
            {tasks.length} Tasks
          </span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5 text-sm font-semibold text-slate-900">{task.title}</td>
                <td className="px-8 py-5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-black shrink-0">
                      {(task.assignedTo?.name || task.assignedToName || '?').charAt(0).toUpperCase()}
                    </div>
                    {task.assignedTo?.name || task.assignedToName || 'Unassigned'}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                  {task.project?.name || '—'}
                </td>
                <td className="px-8 py-5">
                  <select
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border ${
                      task.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      task.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    value={task.status}
                    onChange={e => updateStatus(task._id, e.target.value)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => handleDelete(task._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <ListTodo size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No tasks yet. Click "Assign Tasks" to get started.</p>
          </div>
        )}
      </div>

      <TaskAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={fetchTasks} />
    </div>
  );
}
