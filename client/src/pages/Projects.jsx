import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, X, Users, Loader2, ArrowRight, RefreshCcw, Trash2, Shield, UserPlus, Send, Layers } from 'lucide-react';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = [
  'Team Lead',
  'Manager',
  'Frontend Developer',
  'Backend Developer',
  'R&D / Research',
  'QA / Tester'
];

const ProjectModal = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [quantity, setQuantity] = useState(1);
  const [memberEntries, setMemberEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ name: '', description: '' });
      setQuantity(1);
      setMemberEntries([]);
    }
  }, [isOpen]);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Project Name is required");
    setStep(2);
  };

  const handleQuantityConfirm = () => {
    const entries = Array.from({ length: quantity }, () => ({ name: '', role: '' }));
    setMemberEntries(entries);
    setStep(3);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...memberEntries];
    updated[index][field] = value;
    setMemberEntries(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const teamLeads = memberEntries.filter(m => m.role === 'Team Lead').length;
    const managers = memberEntries.filter(m => m.role === 'Manager').length;

    if (teamLeads !== 1) return toast.error("Exactly 1 Team Lead is required");
    if (managers !== 1) return toast.error("Exactly 1 Manager is required");

    for (let i = 0; i < memberEntries.length; i++) {
      if (!memberEntries[i].name) return toast.error(`Please enter a name for Member ${i+1}`);
      if (!memberEntries[i].role) return toast.error(`Please assign a role to Member ${i+1}`);
    }

    setLoading(true);
    try {
      await projectAPI.create({ name: formData.name, description: formData.description, dueDate: formData.dueDate, members: memberEntries });
      toast.success('Project Created Successfully');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-3xl bg-white rounded-[40px] shadow-2xl relative z-10 p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Step 1: Project Details */}
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Briefcase size={28} className="text-primary"/> Step 1: Project Details
            </h2>
            <div className="space-y-4">
               <label className="text-sm font-semibold text-slate-600">Project Name</label>
               <input autoFocus required className="pro-input bg-white text-lg font-bold" placeholder="e.g. AI Med Assist" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               
               <label className="text-sm font-semibold text-slate-600 mt-4 block">Due Date (Deadline)</label>
               <input type="date" required className="pro-input bg-white text-lg font-bold" value={formData.dueDate || ''} onChange={e => setFormData({...formData, dueDate: e.target.value})} />

               <label className="text-sm font-semibold text-slate-600 mt-4 block">Description</label>
               <textarea className="pro-input min-h-[120px] resize-none bg-white" placeholder="Briefly describe the objective..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <button type="submit" className="btn-premium w-full !py-4 text-lg font-semibold flex items-center justify-center gap-2">
               Continue to Team Builder <ArrowRight size={20} />
            </button>
          </form>
        )}

        {/* Step 2: Quantity */}
        {step === 2 && (
          <div className="space-y-8">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl">{formData.name.charAt(0) || 'P'}</div>
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{formData.name}</h2>
                   <p className="text-xs text-slate-500 mt-1">Project Initialization</p>
                </div>
             </div>
             <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                   <Users size={24} className="text-primary"/> Step 2: Team Size
                </h2>
                <label className="text-sm font-semibold text-slate-700 block">How many members will be in this project team?</label>
                <div className="flex items-center gap-4">
                   <input type="number" min="2" max="20" className="pro-input w-32 text-center text-xl font-bold" value={quantity} onChange={e => setQuantity(e.target.value)} />
                   <button onClick={handleQuantityConfirm} className="btn-premium flex-1 !py-4 text-lg font-semibold flex items-center justify-center gap-2">
                     Define {quantity} Roles <ArrowRight size={20} />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Step 3: Define Roles */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Shield size={24} className="text-primary"/> Step 3: Assign Roles
             </h2>
             
             <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-sm font-semibold flex gap-2">
               <span>⚠️</span> You MUST assign exactly 1 <b>Team Lead</b> and 1 <b>Manager</b>.
             </div>

             <div className="space-y-4">
                {memberEntries.map((entry, i) => (
                  <div key={i} className="p-6 border border-slate-100 rounded-[24px] bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input className="pro-input bg-white" placeholder={`Member ${i+1} Name`} value={entry.name} onChange={e => updateEntry(i, 'name', e.target.value)} />
                     <select className="pro-input bg-white" value={entry.role} onChange={e => updateEntry(i, 'role', e.target.value)}>
                        <option value="">Assign Role</option>
                        {ROLES.map(r => {
                          const isTLAssigned = memberEntries.some((m, idx) => m.role === 'Team Lead' && idx !== i);
                          const isMgrAssigned = memberEntries.some((m, idx) => m.role === 'Manager' && idx !== i);
                          if (r === 'Team Lead' && isTLAssigned) return null;
                          if (r === 'Manager' && isMgrAssigned) return null;
                          return <option key={r} value={r}>{r}</option>;
                        })}
                     </select>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-4">
               <button type="button" onClick={() => setStep(2)} className="pro-input !py-4 !bg-slate-100 hover:!bg-slate-200 font-semibold text-slate-600 transition-colors">
                  Back
               </button>
               <button type="submit" disabled={loading} className="btn-premium flex-1 !py-4 text-lg font-semibold flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={20}/> Launch Project</>}
               </button>
             </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [progressMap, setProgressMap] = useState({}); // projectId -> {progress, status}
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hiddenIds, setHiddenIds] = useState(() => JSON.parse(localStorage.getItem('hiddenProjects') || '[]'));
  const { user } = useAuth();

  useEffect(() => { fetchAll(); }, [hiddenIds]);
  
  const fetchAll = () => {
    const hiddenTasks = JSON.parse(localStorage.getItem('hiddenTasks') || '[]');
    Promise.all([
      projectAPI.getAll(),
      taskAPI.getAll()
    ]).then(([projRes, taskRes]) => {
      const visible = projRes.data.filter(p => !hiddenIds.includes(String(p._id)));
      setProjects(visible);

      // Build dynamic progress map from tasks
      const allTasks = taskRes.data.filter(t => !hiddenTasks.includes(String(t._id)));
      const map = {};
      visible.forEach(p => {
        const pid = String(p._id);
        const ptasks = allTasks.filter(t => {
          const tid = typeof t.project === 'object' && t.project ? String(t.project._id) : String(t.project || '');
          return tid === pid;
        });
        const total = ptasks.length;
        const done  = ptasks.filter(t => t.status === 'Done').length;
        const inProg = ptasks.some(t => t.status === 'In Progress');
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        const isCompleted = total > 0 && done === total;
        const isOngoing   = !isCompleted && (inProg || done > 0);
        map[pid] = { progress, isCompleted, isOngoing };
      });
      setProgressMap(map);
    }).catch(console.error);
  };

  const handleDeleteSingle = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    const newHidden = [...hiddenIds, String(id)];
    setHiddenIds(newHidden);
    localStorage.setItem('hiddenProjects', JSON.stringify(newHidden));
  };

  const getTeamLeadName = (project) => {
    if (!project.members) return 'Unassigned';
    const tl = project.members.find(m => m.role === 'Team Lead');
    if (!tl) return 'Unassigned';
    return tl.name || tl.user?.name || 'Unassigned';
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage all your team's projects in one place.</p>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === 'Admin' && (
            <button onClick={() => setIsModalOpen(true)} className="btn-premium flex items-center gap-2">
              <Plus size={18} /> New Project
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => {
          const pstat = progressMap[String(p._id)] || {};
          const statusLabel = pstat.isCompleted ? '✅ Completed' : pstat.isOngoing ? `${pstat.progress}% Ongoing` : 'Upcoming';
          const statusClass  = pstat.isCompleted
            ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
            : pstat.isOngoing
            ? 'text-amber-600 bg-amber-50 border-amber-100'
            : 'text-slate-500 bg-slate-50 border-slate-200';

          return (
            <div
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col h-[320px] shadow-sm hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => handleDeleteSingle(e, p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-2xl">
                  {p.name?.charAt(0) || 'P'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{p.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">{p.description || 'No description provided.'}</p>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">Team Lead</p>
                  <p className="text-xs font-bold text-slate-700">{getTeamLeadName(p)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">{p.members?.length || 0} Members</p>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${statusClass}`}>
                    {statusLabel}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {projects.length === 0 && (
        <div className="py-32 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
           <Briefcase size={48} className="mx-auto mb-4 text-slate-200" />
           <p className="font-medium">No projects found. Create one to get started.</p>
        </div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={fetchAll} />
    </div>
  );
}
