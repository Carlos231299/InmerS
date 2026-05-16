import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Profiles from './components/Profiles';
import LogoCarousel from './components/LogoCarousel';
import Review from './components/Review';
import MainCarousel from './components/MainCarousel';
import InstitutionDetail from './pages/InstitutionDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { API_URL } from './config';
import { Toaster } from 'sonner';

const HomePage: React.FC = () => {
  return (
    <main className="animate-in fade-in duration-700">
      <MainCarousel />
      <Review />
      <Profiles />
      <LogoCarousel />
    </main>
  );
};

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null);

  React.useEffect(() => {
    axios.get(`${API_URL}/api/activities`)
      .then(res => setActivities(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-10 md:p-20">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">Sección de Actividades</h1>
        <p className="text-xl text-gray-600 mb-12 text-center font-medium">Visualiza y descarga los documentos de las actividades institucionales.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {activities.length > 0 ? activities.map((activity) => (
            <div key={activity.id} className="flex flex-col gap-4 animate-in zoom-in-95 duration-500">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-[600px] border border-gray-100">
                <iframe src={activity.drive_link} className='w-full h-full' title={activity.name} />
              </div>
              <div className="text-center">
                <p className="font-bold text-blue-900 text-lg">{activity.name}</p>
                {activity.description && (
                  <>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">{activity.description}</p>
                    <button 
                      onClick={() => setSelectedActivity(activity)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2 inline-flex items-center gap-1 transition-colors"
                    >
                      Ver más detalles →
                    </button>
                  </>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-xl font-medium tracking-tight">No hay actividades publicadas actualmente.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Activity Detail */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-blue-900 mb-6 pr-8 border-b pb-4">{selectedActivity.name}</h3>
              <div className="overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1">
                <p className="whitespace-pre-line text-gray-600 leading-relaxed text-lg">
                  {selectedActivity.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster position="top-right" richColors />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/institucion/:id" element={<InstitutionDetail />} />
          <Route path="/actividades" element={<ActivitiesPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <footer className="bg-black text-white py-10">
          <div className="container mx-auto px-4 text-center opacity-60 text-sm">
            &copy; {new Date().getFullYear()} Corporación Universitaria UNIMINUTO. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
