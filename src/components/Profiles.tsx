import React from 'react';
import { motion } from 'framer-motion';

const Profiles: React.FC = () => {
  const profiles = [
    { 
      name: "ROSA ESTEFANY ESCOBAR ESCOBAR", 
      role: "Estudiante de Trabajo Social - 9° Semestre", 
      description: "Mi formación académica se ha orientado al fortalecimiento de valores como la solidaridad, el compromiso social y la participación comunitaria. Me apasiona compartir experiencias, escuchar y aprender de las personas, así como aportar desde mi conocimiento para generar cambios positivos.",
      img: "https://picsum.photos/seed/rosa/400/500" 
    },
    { 
      name: "SARA CATALINA CORDOBA RUEDA", 
      role: "Estudiante de Psicología - 9° Semestre", 
      description: "Mi formación se ha fundamentado a partir de principios y valores que permiten desenvolverme en el entorno social y formativo con calidez humana, transparencia y respeto. Como psicóloga, busco ayudar a transformar vidas y acompañar procesos para un mejor futuro con vocación y servicio.",
      img: "https://picsum.photos/seed/sara/400/500" 
    },
    { 
      name: "JESUS DAVID RAMIREZ AMAYA", 
      role: "Estudiante de Psicología - 9° Semestre", 
      description: "Mi formación se ha basado en la implementación de valores primarios del ser humano y la construcción del mismo en la sociedad. Me interesa el deporte, el arte y todo lo relacionado con cultura ancestral, búsqueda del ser y la apropiación de nuestro entorno.",
      img: "https://picsum.photos/seed/jesus/400/500" 
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter mb-4">Perfil de los Inmersionistas</h2>
          <div className="w-24 h-1 bg-primary-yellow mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {profiles.map((p, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium group hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 to-transparent flex flex-col justify-end p-8 text-white">
                  <h4 className="text-xl font-bold leading-tight">{p.name}</h4>
                  <p className="text-primary-yellow font-medium text-sm mt-1">{p.role}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-6 italic">
                  "{p.description}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profiles;
