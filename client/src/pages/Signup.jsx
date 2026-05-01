import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight, Loader2, Command } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Admin' }); // Default to Admin
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.signup(formData);
      toast.success('Registration Successful. Please Login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
           <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl italic font-black text-2xl">E</div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Join the Team</h1>
           <p className="text-slate-500 text-sm mt-2">Create your administrative account to begin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
              <input required className="pro-input" placeholder="Operator Name" onChange={e => setFormData({...formData, name: e.target.value})} />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Email</label>
              <input type="email" required className="pro-input" placeholder="name@ethara.pro" onChange={e => setFormData({...formData, email: e.target.value})} />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
              <input type="password" required className="pro-input" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Role</label>
              <select className="pro-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                 <option value="Admin">Admin (Full Access)</option>
                 <option value="Member">Member (View Only)</option>
              </select>
           </div>
           <button disabled={isLoading} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Initialize Account'}
           </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
           In registry? <Link to="/login" className="text-slate-950 underline underline-offset-4">Sign Access</Link>
        </p>
      </motion.div>
    </div>
  );
}
