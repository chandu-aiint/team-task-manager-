import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, Clock, Award, ArrowLeft, Loader2, UserPlus, ShieldCheck, ListTodo, Shield, Target } from 'lucide-react';
import { projectAPI, taskAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        projectAPI.getOne(id),
        taskAPI.getAll()
      ]);
      setProject(pRes.data);
      // Filter tasks for this project
      setTasks(tRes.data.filter(t => (t.project?._id || t.project) === id));
    } catch (err) {
      toast.error("Failed to load project details");
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!project) return null;

  // Calculate Performance Stats
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Extract Key Roles
  const teamLead = project.members?.find(m => m.role === 'Team Lead');
  const manager = project.members?.find(m => m.role === 'Manager');
  const otherMembers = project.members?.filter(m => m.role !== 'Team Lead' && m.role !== 'Manager') || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">Project Details</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">Active</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-slate-500 font-medium mt-1">{project.description || 'No description provided.'}</p>
          </div>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Overall Progress</p>
            <p className="text-2xl font-bold text-slate-900">{progress}%</p>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-slate-100 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/20" style={{ height: `${progress}%`, bottom: 0, position: 'absolute' }} />
             <span className="relative z-10 font-bold text-xs">{progress}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Management */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={18} className="text-primary" /> Team Structure
            </h2>
            
            <div className="space-y-4">
               {/* Team Lead */}
               <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-primary">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Team Lead</p>
                      <p className="font-semibold text-sm">{teamLead?.user?.name || teamLead?.name || 'Unassigned'}</p>
                    </div>
                  </div>
               </div>

               {/* Manager */}
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center font-bold text-lg text-emerald-600">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">Manager</p>
                      <p className="font-semibold text-sm">{manager?.user?.name || manager?.name || 'Unassigned'}</p>
                    </div>
                  </div>
               </div>

               {/* Other Members List */}
               {otherMembers.length > 0 && (
                 <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Developers & Specialists</p>
                    {otherMembers.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {m.user?.name?.charAt(0) || m.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{m.user?.name || m.name || 'Team Member'}</p>
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{m.role}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </section>

          {/* Performance Insight */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" /> Task Progress
            </h2>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
                    <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Completed Tasks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{tasks.length}</p>
                    <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Total Tasks</p>
                  </div>
               </div>
               <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
               </div>
            </div>
          </section>
        </div>

        {/* Live Task Board */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[500px]">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ListTodo size={20} className="text-primary"/> Project Tasks
                </h2>
                <div className="flex gap-2">
                  {['Todo', 'In Progress', 'Done'].map(s => (
                    <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg">{s}</span>
                  ))}
                </div>
             </div>

             <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t._id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                           <ShieldCheck size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Task</p>
                           <h4 className="text-base font-semibold text-slate-900">{t.title}</h4>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Assigned To</p>
                        <p className="text-sm font-semibold text-slate-700">{t.assignedTo?.name || 'Unassigned'}</p>
                     </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="py-24 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                     <ListTodo size={40} className="mx-auto mb-3 text-slate-200" />
                     <p className="font-medium text-sm">No tasks assigned to this project yet.</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
