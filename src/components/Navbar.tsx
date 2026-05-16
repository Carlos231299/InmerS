import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import axios from 'axios';

interface Institution {
  id: number;
  name: string;
}

const Navbar: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/institutions')
      .then(res => setInstitutions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-primary-blue shadow-2xl border-b border-blue-900/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo & Text */}
          <Link to="/" className="flex flex-col items-center group min-w-max">
            <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform mb-1 shadow-lg">
              <GraduationCap className="text-primary-blue" size={28} />
            </div>
            <div className="flex items-center gap-2 mt-1 leading-tight whitespace-nowrap">
              <span className="text-sm font-bold text-white tracking-widest uppercase">Festival</span>
              <span className="text-sm font-bold text-primary-yellow tracking-widest uppercase">por la Vida</span>
            </div>
          </Link>

          {/* Institutions Buttons - Pill Style */}
          <div className="flex flex-wrap justify-center gap-2">
            {institutions.map(inst => (
              <Link
                key={inst.id}
                to={`/institucion/${inst.id}`}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all hover:border-primary-yellow hover:text-primary-yellow whitespace-nowrap"
              >
                {inst.name}
              </Link>
            ))}
          </div>

          {/* Activities Button - Solid Primary */}
          <Link
            to="/actividades"
            className="bg-primary-yellow text-primary-blue px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,205,0,0.3)] hover:shadow-[0_0_30px_rgba(255,205,0,0.5)]"
          >
            <BookOpen size={18} />
            <span className="text-sm">Actividades</span>
          </Link>
        </div>
      </div >
    </nav >
  );
};

export default Navbar;
