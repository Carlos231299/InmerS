import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Credenciales incorrectas. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="text-blue-900" size={32} />
          </div>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Acceso Administrativo</h2>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para gestionar el portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-primary-yellow/20 focus:border-primary-yellow outline-none transition-all"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-primary-yellow/20 focus:border-primary-yellow outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100 animate-bounce">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/30 flex items-center justify-center gap-2"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
