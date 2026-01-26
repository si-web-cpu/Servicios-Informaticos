
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'services' | 'contact' | 'settings'>('news');
  
  // Feedback State
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data States
  const [news, setNews] = useState(storageService.getNews());
  const [services, setServices] = useState(storageService.getServices());
  const [contact, setContact] = useState(storageService.getContact());
  const [settings, setSettings] = useState(storageService.getSettings());

  // Form States
  const [editItem, setEditItem] = useState<any>(null);
  const [editService, setEditService] = useState<any>(null);

  const showFeedback = (msg: string, type: 'success' | 'error') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'Admin_2025!#') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  const simulateSave = async (saveFn: () => void, successMsg: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      saveFn();
      showFeedback(successMsg, 'success');
    } catch (err) {
      showFeedback('Hubo un problema al procesar la solicitud', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(() => {
      let updated;
      if (editItem.id) {
        updated = news.map((n: any) => n.id === editItem.id ? editItem : n);
      } else {
        updated = [{ ...editItem, id: Date.now().toString() }, ...news];
      }
      setNews(updated);
      storageService.saveNews(updated);
      setEditItem(null);
    }, 'Noticia guardada con éxito');
  };

  const handleDeleteNews = (id: string) => {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    simulateSave(() => {
      const updated = news.filter((n: any) => n.id !== id);
      setNews(updated);
      storageService.saveNews(updated);
    }, 'Noticia eliminada');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(() => {
      let updated;
      if (editService.id) {
        updated = services.map((s: any) => s.id === editService.id ? editService : s);
      } else {
        updated = [...services, { ...editService, id: Date.now().toString() }];
      }
      setServices(updated);
      storageService.saveServices(updated);
      setEditService(null);
    }, 'Servicio actualizado');
  };

  const handleDeleteService = (id: string) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    simulateSave(() => {
      const updated = services.filter((s: any) => s.id !== id);
      setServices(updated);
      storageService.saveServices(updated);
    }, 'Servicio eliminado');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(() => {
      storageService.saveContact(contact);
    }, 'Configuración guardada correctamente');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(() => {
      storageService.saveSettings(settings);
    }, 'Ajustes del sistema actualizados');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">S</div>
            <h1 className="text-2xl font-bold text-slate-900">Panel Staff</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-600" 
              value={user} 
              onChange={e => setUser(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-600" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
            />
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Entrar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 relative">
      
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce ${
            feedback.type === 'success' ? 'bg-white text-green-700 border-green-100' : 'bg-white text-red-700 border-red-100'
          }`}>
            <i className={`fa-solid ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
            <span className="font-bold text-sm">{feedback.msg}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Configuración Staff</h1>
          <button onClick={() => setIsAuthenticated(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 transition-all">Cerrar Sesión</button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
          {['news', 'services', 'contact', 'settings'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-4 font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'news' ? 'Noticias' : tab === 'services' ? 'Servicios' : tab === 'contact' ? 'Contacto y Redes' : 'Sistema'}
            </button>
          ))}
        </div>

        {activeTab === 'news' && (
          <div className="space-y-6">
            <button onClick={() => setEditItem({ title: '', excerpt: '', fullContent: '', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475', date: new Date().toLocaleDateString(), author: 'Staff' })} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">+ Crear Noticia</button>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold text-slate-700">Título</th><th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {news.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.title}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditItem(item)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeleteNews(item.id)} className="text-red-600 font-bold hover:underline">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <button onClick={() => setEditService({ title: '', category: 'hogar', icon: 'fa-microchip', desc: '', info: '' })} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">+ Crear Servicio</button>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold text-slate-700">Servicio</th><th className="px-6 py-4 font-bold text-slate-700">Categoría</th><th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{s.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${s.category === 'hogar' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {s.category === 'hogar' ? 'Hogar' : 'Negocios'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditService(s)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeleteService(s.id)} className="text-red-600 font-bold hover:underline">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Datos Públicos y Redes</h2>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</label>
                  <input type="text" className="w-full border p-3 rounded-xl" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                  <input type="email" className="w-full border p-3 rounded-xl" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp (Nros sin +)</label>
                <input type="text" className="w-full border p-3 rounded-xl" value={contact.whatsapp} onChange={e => setContact({...contact, whatsapp: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Facebook URL</label>
                  <input type="text" placeholder="https://..." className="w-full border p-3 rounded-xl" value={contact.facebook || ''} onChange={e => setContact({...contact, facebook: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Instagram URL</label>
                  <input type="text" placeholder="https://..." className="w-full border p-3 rounded-xl" value={contact.instagram || ''} onChange={e => setContact({...contact, instagram: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4 shadow-lg hover:bg-blue-700 transition-colors">
                {isSaving ? 'Guardando...' : 'Actualizar Información'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Ajustes Técnicos</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase">Endpoint Formulario (Formspree)</label>
                <input 
                  type="text" 
                  className="w-full border p-3 rounded-xl font-mono text-sm bg-slate-50" 
                  value={settings.formEndpoint} 
                  onChange={e => setSettings({...settings, formEndpoint: e.target.value})} 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Guardar Cambios del Sistema</button>
            </form>
          </div>
        )}

        {/* MODAL NOTICIAS */}
        {editItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl my-8">
              <h2 className="text-xl font-bold mb-6 text-slate-900">Editor de Noticia</h2>
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Título</label>
                  <input type="text" required className="w-full border p-3 rounded-xl" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">URL de Imagen</label>
                  <input type="text" required className="w-full border p-3 rounded-xl" value={editItem.image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Resumen</label>
                  <textarea required className="w-full border p-3 rounded-xl" rows={2} value={editItem.excerpt} onChange={e => setEditItem({...editItem, excerpt: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Cuerpo de la Noticia</label>
                  <textarea required className="w-full border p-3 rounded-xl" rows={5} value={editItem.fullContent} onChange={e => setEditItem({...editItem, fullContent: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Guardar</button>
                  <button type="button" onClick={() => setEditItem(null)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold">Cerrar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL SERVICIOS */}
        {editService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-slate-900">Configurar Servicio</h2>
              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Servicio</label>
                  <input type="text" required className="w-full border p-3 rounded-xl" value={editService.title} onChange={e => setEditService({...editService, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                  <select 
                    className="w-full border p-3 rounded-xl bg-white"
                    value={editService.category}
                    onChange={e => setEditService({...editService, category: e.target.value})}
                  >
                    <option value="hogar">Para el Hogar</option>
                    <option value="negocios">Para Negocios</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Descripción Corta</label>
                  <textarea required className="w-full border p-3 rounded-xl" rows={3} value={editService.desc} onChange={e => setEditService({...editService, desc: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Guardar</button>
                  <button type="button" onClick={() => setEditService(null)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
