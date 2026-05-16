import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

interface CarouselItem {
  id: number;
  url: string;
  title: string;
  description: string;
}

const MainCarousel: React.FC = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/api/carousel`)
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (items.length > 1) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ x: '100%', opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img 
            src={items[index].url.startsWith('/') ? `${API_URL}${items[index].url}` : items[index].url} 
            className="w-full h-full object-cover opacity-60" 
            alt={items[index].title} 
          />
          <div className="absolute inset-0 bg-linear-to-b from-blue-900/40 via-transparent to-blue-900/80" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter"
            >
              {items[index].title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-2xl text-primary-yellow font-bold max-w-3xl"
            >
              {items[index].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
        {items.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-primary-yellow w-10' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default MainCarousel;
