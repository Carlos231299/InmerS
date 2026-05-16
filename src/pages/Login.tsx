import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, GraduationCap } from 'lucide-react';
import { API_URL } from '../config';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        toast.success('¡Bienvenido, Administrador!');
        window.location.href = '/admin';
      }
    } catch (err) {
      toast.error('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="p-8 text-center bg-primary-yellow">
          <div className="inline-flex p-4 bg-primary-blue rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-2xl font-black text-primary-blue uppercase tracking-tight">Acceso Administrativo</h1>
          <p className="text-blue-900/60 font-bold text-sm mt-1">Festival por la Vida</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:bg-white outline-none transition-all"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-yellow focus:bg-white outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl hover:bg-blue-800 hover:-translate-y-1 active:translate-y-0 transition-all"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
