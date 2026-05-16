import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const LogoCarousel: React.FC = () => {
  const [logos, setLogos] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/logos`);
        setLogos(res.data);
      } catch (err) {}
    };
    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="py-20 overflow-hidden bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-gray-400 font-semibold uppercase tracking-widest text-sm">Nuestras Alianzas</h3>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap min-w-full">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <img key={i} src={logo.url.startsWith('/') ? `${API_URL}${logo.url}` : logo.url} alt="Logo" className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 shrink-0" />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default LogoCarousel;
