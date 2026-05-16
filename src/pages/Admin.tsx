import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, FileText, Image as ImageIcon, Plus, Trash2, Edit, LogOut, Upload } from 'lucide-react';
import { API_URL } from '../config';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'gallery'>('activities');
  const [activities, setActivities] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');

  // Form states
  const [activityForm, setActivityForm] = useState({ name: '', drive_link: '', description: '' });
  const [imageForm, setImageForm] = useState({ url: '', title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchInstitutions();
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

  const fetchGallery = async (instId: string) => {
    if (!instId) return;
    const res = await axios.get(`${API_URL}/api/institutions/${instId}/images`);
    setGalleryImages(res.data);
  };

  useEffect(() => {
    if (selectedInstitution) fetchGallery(selectedInstitution);
  }, [selectedInstitution]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  // Activity Handlers
  const saveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      await axios.put(`${API_URL}/api/activities/${editingActivity}`, activityForm);
    } else {
      await axios.post(`${API_URL}/api/activities`, activityForm);
    }
    setActivityForm({ name: '', drive_link: '', description: '' });
    setEditingActivity(null);
    fetchActivities();
  };

  const deleteActivity = async (id: number) => {
    if (confirm('¿Eliminar esta actividad?')) {
      await axios.delete(`${API_URL}/api/activities/${id}`);
      fetchActivities();
    }
  };

  // Image Handlers
  const saveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('institution_id', selectedInstitution);
      formData.append('title', imageForm.title);
      formData.append('description', imageForm.description);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (imageForm.url) {
        formData.append('url', imageForm.url);
      } else {
        alert('Por favor selecciona un archivo o ingresa una URL');
        setUploadLoading(false);
        return;
      }

      await axios.post(`${API_URL}/api/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setImageForm({ url: '', title: '', description: '' });
      setSelectedFile(null);
      fetchGallery(selectedInstitution);
    } catch (err) {
      console.error(err);
      alert('Error al subir la imagen');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (confirm('¿Eliminar esta imagen?')) {
      await axios.delete(`${API_URL}/api/images/${id}`);
      fetchGallery(selectedInstitution);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-blue-800">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <LayoutDashboard size={20} /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('activities')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'activities' ? 'bg-primary-yellow text-blue-900 font-bold' : 'hover:bg-blue-800'}`}
          >
            <FileText size={18} /> Actividades
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'gallery' ? 'bg-primary-yellow text-blue-900 font-bold' : 'hover:bg-blue-800'}`}
          >
            <ImageIcon size={18} /> Galería
          </button>
        </nav>
        <button 
          onClick={handleLogout}
          className="m-4 p-3 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 rounded-xl transition-colors text-sm"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'activities' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Gestión de Actividades</h1>
                <p className="text-gray-500">Añade o edita los documentos de Drive que verán los usuarios.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={saveActivity} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Nombre de la Actividad</label>
                <input 
                  required
                  value={activityForm.name}
                  onChange={e => setActivityForm({...activityForm, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none"
                  placeholder="Ej: Taller de Resiliencia"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Link de Google Drive</label>
                <input 
                  required
                  value={activityForm.drive_link}
                  onChange={e => setActivityForm({...activityForm, drive_link: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Descripción (Opcional)</label>
                <textarea 
                  value={activityForm.description}
                  onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none h-20"
                  placeholder="Breve detalle de la actividad..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                {editingActivity && (
                  <button 
                    type="button"
                    onClick={() => {setEditingActivity(null); setActivityForm({name:'', drive_link:'', description:''})}}
                    className="px-6 py-2 rounded-lg border border-gray-300 font-bold"
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="bg-primary-blue text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800">
                  <Plus size={18} /> {editingActivity ? 'Actualizar' : 'Crear'} Actividad
                </button>
              </div>
            </form>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activities.map(act => (
                <div key={act.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group">
                  <div>
                    <h4 className="font-bold text-blue-900 text-lg mb-1">{act.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{act.description || 'Sin descripción'}</p>
                    <div className="text-[10px] bg-gray-100 p-2 rounded break-all text-gray-400">{act.drive_link}</div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {setEditingActivity(act.id); setActivityForm({name: act.name, drive_link: act.drive_link, description: act.description})}}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteActivity(act.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Galería Institucional</h1>
                <p className="text-gray-500">Gestiona las imágenes que aparecen en cada sede.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">Filtrar por Sede</label>
                <select 
                  value={selectedInstitution}
                  onChange={e => setSelectedInstitution(e.target.value)}
                  className="bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-blue-900 outline-none"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Form with File Support */}
            <form onSubmit={saveImage} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Archivo de Imagen</label>
                <div className="relative group">
                  <input 
                    type="file"
                    onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-yellow cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors"
                  >
                    <Upload size={18} />
                    {selectedFile ? selectedFile.name : 'Seleccionar Archivo'}
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">O URL de la Imagen</label>
                <input 
                  value={imageForm.url}
                  disabled={!!selectedFile}
                  onChange={e => setImageForm({...imageForm, url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none disabled:bg-gray-50"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Título de la Imagen</label>
                <input 
                  required
                  value={imageForm.title}
                  onChange={e => setImageForm({...imageForm, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none"
                  placeholder="Ej: Inauguración del Huerto"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-400">Descripción Obligatoria</label>
                <textarea 
                  required
                  value={imageForm.description}
                  onChange={e => setImageForm({...imageForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-yellow outline-none h-20"
                  placeholder="Detalles sobre qué ocurre en la imagen..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={uploadLoading}
                  className="bg-primary-blue text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50"
                >
                  <ImageIcon size={18} /> {uploadLoading ? 'Subiendo...' : 'Subir a la Galería'}
                </button>
              </div>
            </form>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map(img => (
                <div key={img.id} className="relative aspect-4/3 rounded-2xl overflow-hidden group shadow-sm">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <p className="font-bold text-sm">{img.title}</p>
                    <button 
                      onClick={() => deleteImage(img.id)}
                      className="mt-2 bg-red-600 text-white py-1 px-3 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-700"
                    >
                      <Trash2 size={12} /> Eliminar
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
