import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ListTodo, Briefcase, TrendingUp, CheckCheck, Loader2, RefreshCw } from 'lucide-react';
import { taskAPI, projectAPI } from '../services/api';

export default function Dashboard() {
  const [projectStats, setProjectStats] = useState({ total: 0, ongoing: 0, completed: 0 });
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    const hiddenProjects = JSON.parse(localStorage.getItem('hiddenProjects') || '[]');
    const hiddenTasks    = JSON.parse(localStorage.getItem('hiddenTasks') || '[]');

    Promise.all([taskAPI.getAll(), projectAPI.getAll()])
      .then(([taskRes, projRes]) => {
        const allTasks    = taskRes.data.filter(t => !hiddenTasks.includes(String(t._id)));
        const allProjects = projRes.data.filter(p => !hiddenProjects.includes(String(p._id)));

        // Per-project: compute done count from tasks
        let ongoing   = 0;
        let completed = 0;

        allProjects.forEach(p => {
          const pid    = String(p._id);
          const ptasks = allTasks.filter(t => {
            const tid = t.project && typeof t.project === 'object' ? String(t.project._id) : String(t.project || '');
            return tid === pid;
          });
          const total = ptasks.length;
          if (total === 0) return; // no tasks = upcoming, don't count
          const done    = ptasks.filter(t => t.status === 'Done').length;
          const inProg  = ptasks.some(t => t.status === 'In Progress');
          if (done === total)          completed++;
          else if (inProg || done > 0) ongoing++;
        });

        setProjectStats({ total: allProjects.length, ongoing, completed });
        setTaskStats({
          total:     allTasks.length,
          completed: allTasks.filter(t => t.status === 'Done').length,
          active:    allTasks.filter(t => t.status !== 'Done').length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tick]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  const projCards = [
    { label: 'Total Projects',  value: projectStats.total,     icon: Briefcase,    color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Ongoing',         value: projectStats.ongoing,   icon: TrendingUp,   color: 'text-amber-600', bg: 'bg-amber-50'  },
    { label: 'Completed',       value: projectStats.completed, icon: CheckCheck,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];
  const taskCards = [
    { label: 'Total Tasks',     value: taskStats.total,        icon: ListTodo,     color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Completed Tasks', value: taskStats.completed,    icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'In Progress',     value: taskStats.active,       icon: Clock,        color: 'text-rose-500',   bg: 'bg-rose-50'   },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Management Overview</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time status across all projects and tasks.</p>
        </div>
        <button
          onClick={() => setTick(t => t + 1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </header>

      {/* Project Stats */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Project Overview</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projCards.map(card => (
            <div key={card.label} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6`}>
                <card.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Task Stats */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Task Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taskCards.map(card => (
            <div key={card.label} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6`}>
                <card.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
