import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target } from 'lucide-react';

const Review: React.FC = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Cabecera */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-blue font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              Bienvenidos: Expresiones que liberan
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
              Salud mental y <span className="text-primary-yellow">Redes de apoyo</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Inducción */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50 p-10 rounded-[2.5rem] border-l-8 border-primary-blue relative flex flex-col"
            >
              <Heart className="text-primary-blue mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4 text-blue-900 underline decoration-primary-yellow decoration-4 underline-offset-8">Inducción</h3>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                "La salud mental ha trascendido para entenderse como un fenómeno integral, que se ve influenciado tanto por factores biológicos como por el contexto social del individuo. No se limita únicamente a la gestión de las emociones internas, sino que se construye a través de las interacciones diarias del día a día. En este escenario las redes de apoyo emergen como el pilar fundamental que sostiene la resiliencia del ser humano."
              </p>
            </motion.div>

            {/* Objetivo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary-yellow p-10 rounded-[2.5rem] shadow-2xl relative flex flex-col border-b-8 border-blue-900"
            >
              <Target className="text-black mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4 text-blue-900 underline decoration-primary-black decoration-4 underline-offset-8">Nuestro Objetivo</h3>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                "Promover el bienestar integral de niños, adolescentes y comunidades de Salgar a través de un festival que articule proyecto de vida, relaciones interpersonales y salud mental, con la participación de instituciones educativas y aliados territoriales."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
