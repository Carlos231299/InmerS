import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { API_URL } from '../config';
import { AnimatePresence } from 'framer-motion';

interface Institution {
  id: number;
  name: string;
  description: string;
}

interface Image {
  id: number;
  url: string;
  title: string;
  description: string;
}

const InstitutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/api/institutions/${id}`),
      axios.get(`${API_URL}/api/institutions/${id}/images`)
    ]).then(([instRes, imgRes]) => {
      setInstitution(instRes.data);
      setImages(imgRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
    </div>
  );

  if (!institution) return <div className="container py-20 text-center">Institución no encontrada.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={20} /> Volver al Inicio
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl"
          >
            {institution.name}
          </motion.h1>
          <p className="text-xl opacity-80 max-w-2xl">{institution.description}</p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400 opacity-10 skew-x-12 translate-x-20"></div>
      </div>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-4xl shadow-2xl p-10">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-blue-900">
            <ImageIcon className="text-yellow-500" /> Galería Institucional
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImage(img)}
                className="group relative overflow-hidden rounded-2xl shadow-lg aspect-4/3 cursor-pointer"
              >
                <img 
                  src={img.url.startsWith('/') ? `${API_URL}${img.url}` : img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white text-left">
                  <h4 className="font-bold text-lg mb-1">{img.title}</h4>
                  <p className="text-sm opacity-90 line-clamp-2">{img.description}</p>
                  <span className="text-yellow-400 text-xs font-semibold mt-3 uppercase tracking-wider flex items-center gap-1">Click para ver descripción completa →</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {images.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              No hay imágenes disponibles para esta sede en este momento.
            </div>
          )}
        </div>
      </section>

      {/* Modal for Image Detail */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black transition-colors"
              >
                <X size={20} />
              </button>
              <div className="md:w-1/2 bg-gray-100 min-h-[300px] md:min-h-[500px]">
                <img 
                  src={selectedImage.url.startsWith('/') ? `${API_URL}${selectedImage.url}` : selectedImage.url} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover object-center max-h-[40vh] md:max-h-[70vh]"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                <h3 className="text-3xl font-black text-blue-900 mb-6 uppercase tracking-tight">{selectedImage.title}</h3>
                <div className="overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {selectedImage.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstitutionDetail;
