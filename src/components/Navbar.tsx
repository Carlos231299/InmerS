import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Lock, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

interface Institution {
  id: number;
  name: string;
}

const Navbar: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    axios.get(`${API_URL}/api/institutions`)
      .then(res => setInstitutions(res.data))
      .catch(err => console.error(err));
    
    // Check auth status
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when route changes

  return (
    <nav className="bg-primary-blue sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-6">
          {/* Logo & Brand */}
          <Link to="/" className="flex flex-col items-start group shrink-0">
            <div className="bg-white p-1 rounded-lg group-hover:scale-110 transition-transform shadow-md">
              <GraduationCap className="text-primary-blue" size={32} />
            </div>
            <div className="flex items-center gap-2 mt-1 leading-tight whitespace-nowrap">
              <span className="text-sm font-bold text-white tracking-widest uppercase">Festival</span>
              <span className="text-sm font-bold text-primary-yellow tracking-widest uppercase">por la Vida</span>
            </div>
          </Link>

          {/* Institutions Buttons - Pill Style */}
          <div className="hidden lg:flex flex-wrap justify-center gap-2 flex-1">
            {institutions.map(inst => (
              <Link
                key={inst.id}
                to={`/institucion/${inst.id}`}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all hover:border-primary-yellow hover:text-primary-yellow whitespace-nowrap"
              >
                {inst.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/actividades"
              className="bg-primary-yellow text-primary-blue px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              <BookOpen size={18} />
              <span className="text-xs uppercase">Actividades</span>
            </Link>
            
            <Link
              to={isLoggedIn ? "/admin" : "/login"}
              className={`${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-white/10 hover:bg-white/20'} text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all`}
            >
              {isLoggedIn ? <LayoutDashboard size={18} /> : <Lock size={18} className="text-primary-yellow" />}
              <span className="text-xs uppercase whitespace-nowrap">
                {isLoggedIn ? 'Panel Admin' : 'Admin'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
