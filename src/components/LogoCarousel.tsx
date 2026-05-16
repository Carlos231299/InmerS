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

  // We repeat the logos so they span more than the width of any screen
  // Even if there are 2 logos, repeating 20 times ensures a very long track.
  const trackLogos = Array.from({ length: Math.max(2, Math.ceil(30 / logos.length)) }).flatMap(() => logos);

  return (
    <section className="py-20 overflow-hidden bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-gray-400 font-semibold uppercase tracking-widest text-sm">Nuestras Alianzas</h3>
      </div>
      <div className="relative flex overflow-hidden group marquee-wrapper w-full">
        {/* We use mask-image to fade the edges for a more premium look */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent 10%, transparent 90%, white)' }}></div>
        <div className="flex animate-marquee whitespace-nowrap w-max pr-16 gap-16">
          {trackLogos.map((logo, i) => (
            <img key={i} src={logo.url.startsWith('/') ? `${API_URL}${logo.url}` : logo.url} alt="Logo" className="h-[68px] w-[136px] object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 shrink-0" />
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap w-max pr-16 gap-16" aria-hidden="true">
          {trackLogos.map((logo, i) => (
            <img key={`dup-${i}`} src={logo.url.startsWith('/') ? `${API_URL}${logo.url}` : logo.url} alt="Logo" className="h-[68px] w-[136px] object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 shrink-0" />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .marquee-wrapper:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoCarousel;
