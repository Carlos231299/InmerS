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
    
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <nav className="bg-primary-blue sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 gap-4">
          {/* Logo & Brand - Horizontal Alignment */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-white/5 p-2 rounded-xl group-hover:scale-110 transition-transform border border-white/10">
              <GraduationCap className="text-primary-yellow" size={32} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black text-white tracking-tighter uppercase">Festival</span>
              <span className="text-sm font-bold text-primary-yellow tracking-widest uppercase -mt-1">por la Vida</span>
            </div>
          </Link>

          {/* Institutions Buttons - Pill Style */}
          <div className="hidden xl:flex flex-wrap justify-center gap-1.5 flex-1 px-4">
            {institutions.map(inst => (
              <Link
                key={inst.id}
                to={`/institucion/${inst.id}`}
                className="bg-white/5 hover:bg-white/15 text-white border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all hover:border-primary-yellow hover:text-primary-yellow whitespace-nowrap"
              >
                {inst.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/actividades"
              className="bg-primary-yellow text-primary-blue px-4 py-2 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg text-xs uppercase"
            >
              <BookOpen size={16} />
              <span>Actividades</span>
            </Link>
            
            <Link
              to={isLoggedIn ? "/admin" : "/login"}
              className={`${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-white/5 hover:bg-white/15'} text-white border border-white/10 px-4 py-2 rounded-xl font-black flex items-center gap-2 transition-all text-xs uppercase`}
            >
              {isLoggedIn ? <LayoutDashboard size={16} /> : <Lock size={16} className="text-primary-yellow" />}
              <span className="whitespace-nowrap">
                {isLoggedIn ? 'Panel' : 'Admin'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
