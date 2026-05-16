import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../config';

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
                className="group relative overflow-hidden rounded-2xl shadow-lg aspect-4/3"
              >
                <img 
                  src={img.url.startsWith('/') ? `${API_URL}${img.url}` : img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white text-left">
                  <h4 className="font-bold text-lg mb-1">{img.title}</h4>
                  <p className="text-xs opacity-80 line-clamp-2">{img.description}</p>
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
    </div>
  );
};

export default InstitutionDetail;
