import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Profiles from './components/Profiles';
import LogoCarousel from './components/LogoCarousel';
import Review from './components/Review';
import InstitutionDetail from './pages/InstitutionDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';

const HomePage: React.FC = () => {
  return (
    <main className="animate-in fade-in duration-700">
      <Review />
      <Profiles />
      <LogoCarousel />
    </main>
  );
};

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios.get('http://localhost:3001/api/activities')
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
                {activity.description && <p className="text-sm text-gray-500">{activity.description}</p>}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-xl font-medium tracking-tight">No hay actividades publicadas actualmente.</p>
            </div>
          )}
        </div>
      </div>
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
