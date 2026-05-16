import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, FileText, Image as ImageIcon, Plus, Trash2, LogOut, Upload, Users, PlayCircle, Edit } from 'lucide-react';
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
    try { const res = await axios.get(`${API_URL}/api/activities`); setActivities(res.data); } catch (err) {}
  };

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/institutions`);
      setInstitutions(res.data);
      if (res.data.length > 0) setSelectedInstitution(res.data[0].id);
    } catch (err) {}
  };

  const fetchGallery = async (id: string) => {
    if (!id) return;
    try { const res = await axios.get(`${API_URL}/api/institutions/${id}/images`); setGalleryImages(res.data); } catch (err) {}
  };

  const fetchCarousel = async () => {
    try { const res = await axios.get(`${API_URL}/api/carousel`); setCarouselItems(res.data); } catch (err) {}
  };

  const fetchProfiles = async () => {
    try { const res = await axios.get(`${API_URL}/api/profiles`); setProfiles(res.data); } catch (err) {}
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
      toast.success('Actividad creada con éxito');
      resetForm();
      fetchActivities();
    } catch (err) { toast.error('Error al guardar la actividad'); }
  };

  const deleteActivity = async (id: number) => {
    if (confirm('¿Eliminar esta actividad?')) {
      try {
        await axios.delete(`${API_URL}/api/activities/${id}`);
        toast.success('Actividad eliminada');
        fetchActivities();
      } catch (err) { toast.error('No se pudo eliminar'); }
    }
  };

  const handleUpload = async (endpoint: string, data: any, callback: Function) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (selectedFile) formData.append('image', selectedFile);

      if (editingId) {
        await axios.put(`${API_URL}/api/${endpoint}/${editingId}`, formData);
        toast.success('Actualizado correctamente');
      } else {
        await axios.post(`${API_URL}/api/${endpoint}`, formData);
        toast.success('Guardado correctamente');
      }
      
      resetForm();
      callback();
    } catch (err) { toast.error('Error al subir. Verifica tamaño y permisos.'); }
    finally { setLoading(false); }
  };

  const deleteItem = async (endpoint: string, id: number, callback: Function) => {
    if (confirm('¿Eliminar definitivamente?')) {
      try {
        await axios.delete(`${API_URL}/api/${endpoint}/${id}`);
        toast.success('Eliminado correctamente');
        callback();
      } catch (err) { toast.error('Error al eliminar'); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 text-center border-b border-blue-800">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <LayoutDashboard size={20} /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'activities', label: 'Actividades', icon: FileText },
            { id: 'gallery', label: 'Galería', icon: ImageIcon },
            { id: 'carousel', label: 'Carrusel Inicio', icon: PlayCircle },
            { id: 'profiles', label: 'Inmersionistas', icon: Users },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => {setActiveTab(item.id as Tab); resetForm();}}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold tracking-wide ${activeTab === item.id ? 'bg-primary-yellow text-blue-900 shadow-md' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button 
          onClick={handleLogout} 
          className="m-4 p-3 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-100 hover:text-white rounded-xl transition-colors text-sm font-bold tracking-wide"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* TAB: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Gestión de Actividades</h1>
              <p className="text-gray-500 mt-1">Añade o edita los documentos de Drive que verán los usuarios.</p>
            </div>

            <form onSubmit={saveActivity} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Nombre de la Actividad</label>
                <input 
                  required value={activityForm.name} onChange={e => setActivityForm({...activityForm, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="Ej. Taller de Resiliencia"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Link de Google Drive</label>
                <input 
                  required value={activityForm.drive_link} onChange={e => setActivityForm({...activityForm, drive_link: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Descripción (Opcional)</label>
                <textarea 
                  value={activityForm.description} onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow h-20"
                  placeholder="Breve detalle de la actividad..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="bg-primary-blue text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-md">
                  <Plus size={18} /> Crear Actividad
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activities.map(act => (
                <div key={act.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-blue-900 text-lg mb-1">{act.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{act.description || 'Sin descripción'}</p>
                    <div className="text-[10px] bg-gray-50 border border-gray-100 p-2 rounded-lg break-all text-gray-400 font-mono">{act.drive_link}</div>
                  </div>
                  <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteActivity(act.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold">
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Galería Institucional</h1>
                <p className="text-gray-500 mt-1">Gestiona las imágenes que aparecen en cada sede.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">Filtrar por Sede</label>
                <select 
                  value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)}
                  className="bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-blue-900 outline-none focus:ring-2 focus:ring-primary-yellow shadow-sm"
                >
                  {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                </select>
              </div>
            </div>

            <form onSubmit={(e) => {e.preventDefault(); handleUpload('images', { institution_id: selectedInstitution, ...imageForm }, () => fetchGallery(selectedInstitution))}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Archivo de Imagen</label>
                <div className="relative group">
                  <input type="file" onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload-gallery" accept="image/*" />
                  <label htmlFor="file-upload-gallery" className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-yellow cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors bg-gray-50">
                    <Upload size={18} /> {selectedFile ? selectedFile.name : 'Seleccionar Archivo Físico'}
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">O URL de la Imagen</label>
                <input 
                  value={imageForm.url} disabled={!!selectedFile} onChange={e => setImageForm({...imageForm, url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-shadow"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Título de la Imagen</label>
                <input 
                  required value={imageForm.title} onChange={e => setImageForm({...imageForm, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="Ej: Inauguración del Huerto"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Descripción</label>
                <textarea 
                  required value={imageForm.description} onChange={e => setImageForm({...imageForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow h-20"
                  placeholder="Detalles sobre qué ocurre en la imagen..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={loading} className="bg-primary-blue text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50 transition-all shadow-md">
                  <ImageIcon size={18} /> {loading ? 'Subiendo...' : 'Subir a la Galería'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map(img => (
                <div key={img.id} className="relative aspect-4/3 rounded-2xl overflow-hidden group shadow-md border border-gray-100">
                  <img src={img.url.startsWith('/') ? `${API_URL}${img.url}` : img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <p className="font-bold text-sm leading-tight drop-shadow-md">{img.title}</p>
                    <button onClick={() => deleteItem('images', img.id, () => fetchGallery(selectedInstitution))} className="mt-3 bg-red-600/90 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors w-fit">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CAROUSEL */}
        {activeTab === 'carousel' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Carrusel Principal</h1>
              <p className="text-gray-500 mt-1">Configura las imágenes gigantes que aparecen al abrir la página web.</p>
            </div>

            <form onSubmit={(e) => {e.preventDefault(); handleUpload('carousel', carouselForm, fetchCarousel)}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Imagen de Fondo (Alta Calidad)</label>
                <div className="relative group">
                  <input type="file" onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload-carousel" accept="image/*" />
                  <label htmlFor="file-upload-carousel" className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-yellow cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors bg-gray-50">
                    <Upload size={18} /> {selectedFile ? selectedFile.name : 'Subir Archivo'}
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">O URL Externa</label>
                <input 
                  value={carouselForm.url} disabled={!!selectedFile} onChange={e => setCarouselForm({...carouselForm, url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-shadow"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Título del Slide</label>
                <input 
                  required value={carouselForm.title} onChange={e => setCarouselForm({...carouselForm, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="Ej: Transformando Vidas"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Descripción del Slide</label>
                <textarea 
                  required value={carouselForm.description} onChange={e => setCarouselForm({...carouselForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow h-20"
                  placeholder="Añade un subtítulo llamativo..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={loading} className="bg-primary-blue text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50 transition-all shadow-md">
                  <PlayCircle size={18} /> {loading ? 'Subiendo...' : 'Añadir al Carrusel'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carouselItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group flex flex-col h-[280px]">
                  <div className="h-40 overflow-hidden relative">
                    <img src={item.url.startsWith('/') ? `${API_URL}${item.url}` : item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
                  </div>
                  <div className="p-5 flex-1 bg-white relative">
                    <h4 className="font-black text-blue-900 text-lg leading-tight mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <button onClick={() => deleteItem('carousel', item.id, fetchCarousel)} className="absolute -top-6 right-4 bg-red-600 text-white p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 hover:scale-110">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Inmersionistas</h1>
              <p className="text-gray-500 mt-1">Crea y edita los perfiles del equipo que lidera los proyectos.</p>
            </div>

            <form onSubmit={(e) => {e.preventDefault(); handleUpload('profiles', profileForm, fetchProfiles)}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Nombre del Inmersionista</label>
                <input 
                  required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="Ej: María José Vélez"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Cargo / Semestre</label>
                <input 
                  required value={profileForm.role} onChange={e => setProfileForm({...profileForm, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow"
                  placeholder="Estudiante de Psicología, IX Semestre"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Foto de Perfil</label>
                <div className="relative group">
                  <input type="file" onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload-profile" accept="image/*" />
                  <label htmlFor="file-upload-profile" className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-yellow cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors bg-gray-50">
                    <Upload size={18} /> {selectedFile ? selectedFile.name : 'Subir Foto'}
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">O URL Externa</label>
                <input 
                  value={profileForm.image_url} disabled={!!selectedFile} onChange={e => setProfileForm({...profileForm, image_url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-shadow"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Biografía / Perfil</label>
                <textarea 
                  required value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none transition-shadow h-24"
                  placeholder="Cuéntanos un poco sobre su experiencia y aporte..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={loading} className="bg-primary-blue text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50 transition-all shadow-md">
                  <Users size={18} /> {loading ? 'Guardando...' : (editingId ? 'Actualizar Perfil' : 'Crear Perfil')}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5 relative group hover:shadow-md transition-all">
                  <div className="w-28 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={p.image_url.startsWith('/') ? `${API_URL}${p.image_url}` : p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                  </div>
                  <div className="flex-1 min-w-0 pr-16">
                    <h4 className="font-black text-xl text-blue-900 truncate">{p.name}</h4>
                    <p className="text-xs text-primary-yellow font-black uppercase tracking-widest mb-2 truncate bg-blue-900 w-fit px-2 py-0.5 rounded">{p.role}</p>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingId(p.id); setProfileForm({ name: p.name, description: p.description, role: p.role, image_url: p.image_url }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteItem('profiles', p.id, fetchProfiles)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
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
