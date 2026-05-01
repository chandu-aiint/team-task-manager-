import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ListTodo, 
  LogOut, 
  User,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none">
      <div className="p-8 flex items-center gap-3">
         <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-black text-xs italic">E</div>
         <span className="font-black text-xl tracking-tighter text-slate-950">Ethara</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${location.pathname === link.path ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-950 hover:bg-slate-50'}`}
          >
            <link.icon size={18} />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black border border-slate-200 text-slate-900 uppercase">
              {user?.name?.charAt(0)}
           </div>
           <div>
              <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{user?.role}</p>
           </div>
        </div>
        <button 
          onClick={logout}
          className="w-full py-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-slate-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 select-none">
          <div className="flex items-center gap-2 text-slate-400">
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management System</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
             <span className="text-[10px] font-black uppercase text-slate-900">System Live</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
