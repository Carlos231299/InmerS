import React from 'react';

const LogoCarousel: React.FC = () => {
  const logos = [
    "https://picsum.photos/seed/logo1/150/80",
    "https://picsum.photos/seed/logo2/150/80",
    "https://picsum.photos/seed/logo3/150/80",
    "https://picsum.photos/seed/logo4/150/80",
    "https://picsum.photos/seed/logo5/150/80",
    "https://picsum.photos/seed/logo6/150/80"
  ];

  return (
    <section className="py-20 overflow-hidden bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-gray-400 font-semibold uppercase tracking-widest text-sm">Nuestras Alianzas</h3>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap min-w-full">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <img key={i} src={logo} alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 shrink-0" />
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
