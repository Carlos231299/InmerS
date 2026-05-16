import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, FileText, Image as ImageIcon, Plus, Trash2, Edit, LogOut, Upload, Users, PlayCircle } from 'lucide-react';
import { API_URL } from '../config';
import { toast } from 'sonner';

type Tab = 'activities' | 'gallery' | 'carousel' | 'profiles';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [activities, setActivities] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');

  // Form states
  const [activityForm, setActivityForm] = useState({ name: '', drive_link: '', description: '' });
  const [imageForm, setImageForm] = useState({ url: '', title: '', description: '' });
  const [carouselForm, setCarouselForm] = useState({ url: '', title: '', description: '' });
  const [profileForm, setProfileForm] = useState({ name: '', description: '', role: '', image_url: '' });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchInstitutions();
    fetchCarousel();
    fetchProfiles();
  }, []);

  const fetchActivities = async () => {
    const res = await axios.get(`${API_URL}/api/activities`);
    setActivities(res.data);
  };

  const fetchInstitutions = async () => {
    const res = await axios.get(`${API_URL}/api/institutions`);
    setInstitutions(res.data);
    if (res.data.length > 0) setSelectedInstitution(res.data[0].id);
  };

  const fetchGallery = async (id: string) => {
    if (!id) return;
    const res = await axios.get(`${API_URL}/api/institutions/${id}/images`);
    setGalleryImages(res.data);
  };

  const fetchCarousel = async () => {
    const res = await axios.get(`${API_URL}/api/carousel`);
    setCarouselItems(res.data);
  };

  const fetchProfiles = async () => {
    const res = await axios.get(`${API_URL}/api/profiles`);
    setProfiles(res.data);
  };

  useEffect(() => {
    if (selectedInstitution) fetchGallery(selectedInstitution);
  }, [selectedInstitution]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  const resetForm = () => {
    setActivityForm({ name: '', drive_link: '', description: '' });
    setImageForm({ url: '', title: '', description: '' });
    setCarouselForm({ url: '', title: '', description: '' });
    setProfileForm({ name: '', description: '', role: '', image_url: '' });
    setSelectedFile(null);
    setEditingId(null);
  };

  // --- HANDLERS ---
  const saveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/activities`, activityForm);
      toast.success('Actividad guardada');
      resetForm();
      fetchActivities();
    } catch (err) { toast.error('Error'); }
  };

  const deleteActivity = async (id: number) => {
    if (confirm('¿Eliminar?')) {
      await axios.delete(`${API_URL}/api/activities/${id}`);
      fetchActivities();
    }
  };

  const handleUpload = async (endpoint: string, data: any, callback: Function) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (selectedFile) formData.append('image', selectedFile);

      await axios.post(`${API_URL}/api/${endpoint}`, formData);
      toast.success('Guardado correctamente');
      resetForm();
      callback();
    } catch (err) { toast.error('Error al subir'); }
    finally { setLoading(false); }
  };

  const deleteItem = async (endpoint: string, id: number, callback: Function) => {
    if (confirm('¿Eliminar definitivamente?')) {
      await axios.delete(`${API_URL}/api/${endpoint}/${id}`);
      toast.success('Eliminado');
      callback();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800 font-bold text-xl flex items-center gap-2">
          <LayoutDashboard /> InmerS Admin
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'activities', label: 'Actividades', icon: FileText },
            { id: 'gallery', label: 'Galería Sede', icon: ImageIcon },
            { id: 'carousel', label: 'Carrusel Inicio', icon: PlayCircle },
            { id: 'profiles', label: 'Inmersionistas', icon: Users },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => {setActiveTab(item.id as Tab); resetForm();}}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary-yellow text-blue-900 font-bold' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-4 p-3 bg-red-500/20 hover:bg-red-500 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
          <LogOut size={16} /> Salir
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Render Tabs */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Gestión de Actividades</h1>
            <form onSubmit={saveActivity} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-4">
              <input value={activityForm.name} onChange={e => setActivityForm({...activityForm, name: e.target.value})} placeholder="Nombre" className="p-2 border rounded-lg" required />
              <input value={activityForm.drive_link} onChange={e => setActivityForm({...activityForm, drive_link: e.target.value})} placeholder="Link Drive" className="p-2 border rounded-lg" required />
              <textarea value={activityForm.description} onChange={e => setActivityForm({...activityForm, description: e.target.value})} placeholder="Descripción" className="col-span-2 p-2 border rounded-lg" />
              <button type="submit" className="col-span-2 bg-blue-900 text-white py-2 rounded-xl font-bold hover:bg-blue-800">Guardar Actividad</button>
            </form>
            <div className="grid grid-cols-3 gap-4">
              {activities.map(act => (
                <div key={act.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-start">
                  <div>
                    <p className="font-bold">{act.name}</p>
                    <p className="text-xs text-gray-400">{act.drive_link.substring(0, 30)}...</p>
                  </div>
                  <button onClick={() => deleteActivity(act.id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-900 uppercase">Galería Institucional</h1>
              <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="p-2 border rounded-xl font-bold">
                {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
              </select>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); handleUpload('images', { institution_id: selectedInstitution, ...imageForm }, () => fetchGallery(selectedInstitution))}} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-4">
              <input type="file" onChange={e => setSelectedFile(e.target.files![0])} className="p-2 border rounded-lg" />
              <input value={imageForm.url} onChange={e => setImageForm({...imageForm, url: e.target.value})} placeholder="O URL Externa" className="p-2 border rounded-lg" />
              <input value={imageForm.title} onChange={e => setImageForm({...imageForm, title: e.target.value})} placeholder="Título" className="col-span-2 p-2 border rounded-lg" required />
              <textarea value={imageForm.description} onChange={e => setImageForm({...imageForm, description: e.target.value})} placeholder="Descripción" className="col-span-2 p-2 border rounded-lg" required />
              <button type="submit" disabled={loading} className="col-span-2 bg-blue-900 text-white py-2 rounded-xl font-bold">{loading ? 'Subiendo...' : 'Subir a Galería'}</button>
            </form>
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-video">
                  <img src={img.url.startsWith('/') ? `${API_URL}${img.url}` : img.url} className="w-full h-full object-cover" />
                  <button onClick={() => deleteItem('images', img.id, () => fetchGallery(selectedInstitution))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'carousel' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Carrusel de Inicio</h1>
            <form onSubmit={(e) => {e.preventDefault(); handleUpload('carousel', carouselForm, fetchCarousel)}} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-4">
              <input type="file" onChange={e => setSelectedFile(e.target.files![0])} className="p-2 border rounded-lg" />
              <input value={carouselForm.title} onChange={e => setCarouselForm({...carouselForm, title: e.target.value})} placeholder="Título del Slide" className="p-2 border rounded-lg" />
              <textarea value={carouselForm.description} onChange={e => setCarouselForm({...carouselForm, description: e.target.value})} placeholder="Descripción corta" className="col-span-2 p-2 border rounded-lg" />
              <button type="submit" className="col-span-2 bg-blue-900 text-white py-2 rounded-xl font-bold">Añadir al Carrusel</button>
            </form>
            <div className="grid grid-cols-3 gap-6">
              {carouselItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm relative group">
                  <img src={item.url.startsWith('/') ? `${API_URL}${item.url}` : item.url} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p className="font-bold">{item.title}</p>
                    <button onClick={() => deleteItem('carousel', item.id, fetchCarousel)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Inmersionistas (Perfiles)</h1>
            <form onSubmit={(e) => {e.preventDefault(); handleUpload('profiles', profileForm, fetchProfiles)}} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-4">
              <input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} placeholder="Nombre del Estudiante" className="p-2 border rounded-lg" required />
              <input value={profileForm.role} onChange={e => setProfileForm({...profileForm, role: e.target.value})} placeholder="Rol / Semestre" className="p-2 border rounded-lg" required />
              <input type="file" onChange={e => setSelectedFile(e.target.files![0])} className="p-2 border rounded-lg" />
              <textarea value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})} placeholder="Biografía / Descripción" className="col-span-2 p-2 border rounded-lg h-32" required />
              <button type="submit" className="col-span-2 bg-blue-900 text-white py-2 rounded-xl font-bold uppercase tracking-widest">Guardar Perfil</button>
            </form>
            <div className="grid grid-cols-2 gap-6">
              {profiles.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 relative group">
                  <img src={p.image_url.startsWith('/') ? `${API_URL}${p.image_url}` : p.image_url} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  <div>
                    <p className="font-bold text-lg text-blue-900">{p.name}</p>
                    <p className="text-xs text-primary-blue font-bold uppercase mb-2">{p.role}</p>
                    <p className="text-xs text-gray-500 line-clamp-3">{p.description}</p>
                  </div>
                  <button onClick={() => deleteItem('profiles', p.id, fetchProfiles)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
