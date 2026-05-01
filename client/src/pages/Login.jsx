import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Command, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authAPI.login(formData);
      login(res.data.user, res.data.token);
      toast.success('System Access Granted');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Authentication Rejected');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-8 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] space-y-10 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="mx-auto w-16 h-16 bg-white rounded-[20px] flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-8 cursor-pointer"
          >
            <Command size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-white font-display uppercase tracking-[0.1em]">Identity Verification</h1>
          <p className="text-slate-500 font-medium tracking-wide">Enter credentials to access the secure workspace</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Registry Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" required placeholder="operator@ethara.pro"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-600 font-medium"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Secure Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-600 font-medium"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button disabled={isLoading} className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              {isLoading ? <Loader2 className="animate-spin" /> : <>Initialize Session <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/signup" className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-primary" /> Request New Workspace Access
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
