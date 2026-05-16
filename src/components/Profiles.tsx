import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

interface Profile {
  id: number;
  name: string;
  description: string;
  image_url: string;
  role: string;
}

const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/profiles`)
      .then(res => setProfiles(res.data))
      .catch(err => console.error('Error fetching profiles:', err));
  }, []);

  if (profiles.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4 uppercase tracking-tighter">Nuestros Inmersionistas</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Conoce al equipo que lidera la transformación social en el territorio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, idx) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={profile.image_url.startsWith('/') ? `${API_URL}${profile.image_url}` : profile.image_url} 
                  alt={profile.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-blue-900/90 to-transparent text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-yellow">{profile.role}</p>
                  <h3 className="text-xl font-black uppercase">{profile.name}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-sm">{profile.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profiles;
