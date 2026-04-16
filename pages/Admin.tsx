
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'services' | 'contact' | 'settings' | 'stats' | 'apps' | 'portfolio' | 'icons'>('news');
  
  // Feedback State
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data States
  const [news, setNews] = useState(storageService.getNews());
  const [services, setServices] = useState(storageService.getServices());
  const [contact, setContact] = useState(storageService.getContact());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [apps, setApps] = useState(storageService.getApps());
  const [portfolio, setPortfolio] = useState(storageService.getPortfolio());
  const [rawVisits, setRawVisits] = useState<number | null>(null);

  // Form States
  const [editItem, setEditItem] = useState<any>(null);
  const [editService, setEditService] = useState<any>(null);
  const [editApp, setEditApp] = useState<any>(null);
  const [editPortfolio, setEditPortfolio] = useState<any>(null);

  const BASE_VISITS = 1248;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'kakarotto.jj@gmail.com') {
        setIsFirebaseAuthenticated(true);
        setCurrentUser(user);
        // If they are logged in via Firebase, we consider them authenticated for the panel too
        setIsAuthenticated(true);
      } else {
        setIsFirebaseAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'stats') {
      const fetchStats = async () => {
        try {
          // Intentamos obtener el conteo actual
          const res = await fetch('https://api.counterapi.dev/v1/servicios-informaticos-nexus/visits');
          if (!res.ok) throw new Error('Error en la API');
          const data = await res.json();
          setRawVisits(data.count);
        } catch (error) {
          console.error("Error cargando estadísticas:", error);
          // Si falla, intentamos al menos mostrar un valor base o 0 en lugar de guiones
          setRawVisits(0);
        }
      };
      fetchStats();
    }
  }, [isAuthenticated, activeTab]);

  const showFeedback = (msg: string, type: 'success' | 'error') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Actualización de contraseña solicitada por el usuario
    if (user === 'admin' && pass === 'iks1701.NCC') {
      setIsAuthenticated(true);
    } else {
      alert('Acceso denegado. Credenciales incorrectas.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'kakarotto.jj@gmail.com') {
        await signOut(auth);
        alert('Acceso denegado. Esta cuenta no tiene permisos de administrador.');
      }
    } catch (error: any) {
      console.error("Error detallado de Firebase Auth:", error);
      
      let errorMsg = 'Error al intentar iniciar sesión con Google.';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMsg = 'Error: Dominio no autorizado. Debes agregar este dominio en la consola de Firebase (Authentication > Settings > Authorized domains).';
      } else if (error.code === 'auth/popup-blocked') {
        errorMsg = 'Error: El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMsg = 'Error: El inicio de sesión con Google no está habilitado en tu proyecto de Firebase.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'La ventana de inicio de sesión se cerró antes de completar el proceso.';
      } else {
        errorMsg += ` (Código: ${error.code})`;
      }
      
      alert(errorMsg);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  const simulateSave = async (saveFn: () => Promise<void> | void, successMsg: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await saveFn();
      showFeedback(successMsg, 'success');
    } catch (err) {
      console.error(err);
      showFeedback('Error al procesar la solicitud', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      let updated;
      if (editItem.id) {
        updated = news.map((n: any) => n.id === editItem.id ? editItem : n);
      } else {
        updated = [{ ...editItem, id: Date.now().toString() }, ...news];
      }
      setNews(updated);
      await storageService.saveNews(updated);
      setEditItem(null);
    }, 'Noticia guardada exitosamente');
  };

  const handleDeleteNews = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta noticia?')) return;
    simulateSave(async () => {
      const updated = news.filter((n: any) => n.id !== id);
      setNews(updated);
      await storageService.saveNews(updated);
    }, 'Noticia eliminada');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      let updated;
      if (editService.id) {
        updated = services.map((s: any) => s.id === editService.id ? editService : s);
      } else {
        updated = [...services, { ...editService, id: Date.now().toString() }];
      }
      setServices(updated);
      await storageService.saveServices(updated);
      setEditService(null);
    }, 'Servicio actualizado en el catálogo');
  };

  const handleDeleteService = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este servicio?')) return;
    simulateSave(async () => {
      const updated = services.filter((s: any) => s.id !== id);
      setServices(updated);
      await storageService.saveServices(updated);
    }, 'Servicio retirado');
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      let updated;
      if (editApp.id) {
        updated = apps.map((a: any) => a.id === editApp.id ? editApp : a);
      } else {
        updated = [...apps, { ...editApp, id: Date.now().toString() }];
      }
      setApps(updated);
      await storageService.saveApps(updated);
      setEditApp(null);
    }, 'Aplicación actualizada en la lista');
  };

  const handleDeleteApp = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta aplicación?')) return;
    simulateSave(async () => {
      const updated = apps.filter((a: any) => a.id !== id);
      setApps(updated);
      await storageService.saveApps(updated);
    }, 'Aplicación eliminada');
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      let updated;
      if (editPortfolio.id) {
        updated = portfolio.map((p: any) => p.id === editPortfolio.id ? editPortfolio : p);
      } else {
        updated = [...portfolio, { ...editPortfolio, id: Date.now().toString() }];
      }
      setPortfolio(updated);
      await storageService.savePortfolio(updated);
      setEditPortfolio(null);
    }, 'Caso de éxito actualizado');
  };

  const handleDeletePortfolio = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este caso de éxito?')) return;
    simulateSave(async () => {
      const updated = portfolio.filter((p: any) => p.id !== id);
      setPortfolio(updated);
      await storageService.savePortfolio(updated);
    }, 'Caso de éxito eliminado');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      await storageService.saveContact(contact);
    }, 'Datos de contacto sincronizados');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      await storageService.saveSettings(settings);
    }, 'Ajustes del sistema aplicados');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">S</div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500 text-sm mt-1">Identifícate para gestionar el sitio</p>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-xs text-red-800 leading-relaxed">
              <i className="fa-solid fa-triangle-exclamation mr-1 text-red-600"></i>
              <strong className="text-red-700">Atención Crítica:</strong> Para guardar cambios en la base de datos, <strong>DEBES</strong> iniciar sesión con tu cuenta de Google autorizada. El acceso por contraseña es solo de lectura.
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3 mb-6"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Acceder con Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-grow h-px bg-slate-100"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">o usar contraseña</span>
            <div className="flex-grow h-px bg-slate-100"></div>
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
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Acceder al Sistema
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
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            feedback.type === 'success' ? 'bg-white text-green-700 border-green-100' : 'bg-white text-red-700 border-red-100'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              <i className={`fa-solid ${feedback.type === 'success' ? 'fa-check' : 'fa-exclamation'}`}></i>
            </div>
            <span className="font-bold text-sm">{feedback.msg}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isFirebaseAuthenticated && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Modo de Solo Lectura</p>
                <p className="text-xs text-red-700">Has accedido con contraseña, pero necesitas iniciar sesión con Google para guardar cambios.</p>
              </div>
            </div>
            <button onClick={handleGoogleLogin} className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 transition-all">
              Vincular Google
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {currentUser && (
              <img src={currentUser.photoURL} alt="Admin" className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Administración Staff</h1>
              <p className="text-slate-500">{currentUser ? `Conectado como ${currentUser.displayName}` : 'Gestiona noticias, servicios y datos de contacto.'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2">
            <i className="fa-solid fa-power-off"></i> Salir
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto pb-1">
          {['news', 'services', 'apps', 'portfolio', 'contact', 'settings', 'stats', 'icons'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-6 font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'news' ? 'Noticias' : tab === 'services' ? 'Servicios' : tab === 'apps' ? 'Apps' : tab === 'portfolio' ? 'Casos Éxito' : tab === 'contact' ? 'Contacto' : tab === 'settings' ? 'Ajustes' : tab === 'stats' ? 'Estadísticas' : 'Iconos'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
            </button>
          ))}
        </div>

        {activeTab === 'news' && (
          <div className="space-y-6">
            <button onClick={() => setEditItem({ title: '', excerpt: '', fullContent: '', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475', date: new Date().toLocaleDateString(), author: 'Admin' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Nueva Noticia
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Título de la Noticia</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {news.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.title}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditItem(item)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeleteNews(item.id)} className="text-red-600 font-bold hover:underline">Borrar</button>
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
            <button onClick={() => setEditService({ title: '', category: 'hogar', icon: 'fa-microchip', desc: '', info: '' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Añadir Servicio
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Servicio</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Categoría</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{s.title}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.category === 'hogar' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {s.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditService(s)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeleteService(s.id)} className="text-red-600 font-bold hover:underline">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            <button onClick={() => setEditApp({ name: '', description: '', url: '', icon: 'fa-box', category: 'utilidad' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Nueva Aplicación
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Aplicación</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Categoría</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apps.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{a.name}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {a.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditApp(a)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeleteApp(a.id)} className="text-red-600 font-bold hover:underline">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <button onClick={() => setEditPortfolio({ title: '', image: '', tags: [], description: '', challenge: '', solution: '', result: '' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Nuevo Caso de Éxito
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Proyecto</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {portfolio.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{p.title}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditPortfolio(p)} className="text-blue-600 font-bold hover:underline">Editar</button>
                        <button onClick={() => handleDeletePortfolio(p.id)} className="text-red-600 font-bold hover:underline">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Información de Contacto y Horarios</h2>
            <form onSubmit={handleSaveContact} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Teléfono Público</label>
                  <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Email Público</label>
                  <input type="email" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">WhatsApp (Números sin +, ej: 549351...)</label>
                <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.whatsapp} onChange={e => setContact({...contact, whatsapp: e.target.value})} />
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Horarios de Atención</h3>
                <div className="flex items-center gap-3 mb-4">
                  <input 
                    type="checkbox" 
                    id="appointmentOnly"
                    checked={contact.appointmentOnly} 
                    onChange={e => setContact({...contact, appointmentOnly: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="appointmentOnly" className="text-sm font-medium text-slate-700">Atención solo con cita previa</label>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Lunes a Viernes</label>
                    <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.hours.week} onChange={e => setContact({...contact, hours: {...contact.hours, week: e.target.value}})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Sábados</label>
                    <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.hours.sat} onChange={e => setContact({...contact, hours: {...contact.hours, sat: e.target.value}})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Domingos</label>
                    <input type="text" className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.hours.sun} onChange={e => setContact({...contact, hours: {...contact.hours, sun: e.target.value}})} />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Enlaces de Redes Sociales</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Facebook (URL completa)</label>
                    <input type="text" placeholder="https://facebook.com/..." className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.facebook || ''} onChange={e => setContact({...contact, facebook: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Instagram (URL completa)</label>
                    <input type="text" placeholder="https://instagram.com/..." className="w-full border p-3 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={contact.instagram || ''} onChange={e => setContact({...contact, instagram: e.target.value})} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4 shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <i className="fa-solid fa-floppy-disk"></i>}
                {isSaving ? 'Guardando...' : 'Guardar Todos los Cambios'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Infraestructura del Sistema</h2>
            <p className="text-sm text-slate-500 mb-8">Ajustes técnicos avanzados para el funcionamiento del sitio.</p>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">URL de Endpoint (Formspree)</label>
                <input 
                  type="text" 
                  className="w-full border p-4 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={settings.formEndpoint} 
                  onChange={e => setSettings({...settings, formEndpoint: e.target.value})} 
                  placeholder="https://formspree.io/f/tu-id-aqui"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                Actualizar Configuración Técnica
              </button>
            </form>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-blue-600"></i> Tráfico Global
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visitas Reales (API)</p>
                  <p className="text-4xl font-black text-slate-900">{rawVisits !== null ? rawVisits.toLocaleString() : '---'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visitas Públicas (API + Base {BASE_VISITS})</p>
                  <p className="text-4xl font-black text-blue-600">{rawVisits !== null ? (rawVisits + BASE_VISITS).toLocaleString() : '---'}</p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    El contador registra un incremento cada vez que una dirección IP única carga el sitio web. El valor público es el que se muestra en el footer del sitio.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <i className="fa-solid fa-server absolute -bottom-10 -right-10 text-9xl opacity-5"></i>
              <h2 className="text-xl font-bold mb-6">Estado del Servicio</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm opacity-80">CounterAPI: Conectado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm opacity-80">Almacenamiento Local: Sincronizado</span>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Refrescar Datos
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Guía de Iconos (FontAwesome)</h2>
            <p className="text-slate-500 mb-8">Copia y pega estas clases en el campo "Icono" al editar servicios o aplicaciones.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { class: 'fa-laptop-medical', name: 'Soporte PC' },
                { class: 'fa-wifi', name: 'Wi-Fi' },
                { class: 'fa-microchip', name: 'Hardware' },
                { class: 'fa-network-wired', name: 'Redes' },
                { class: 'fa-wand-magic-sparkles', name: 'Magia/IA' },
                { class: 'fa-database', name: 'Base de Datos' },
                { class: 'fa-shield-halved', name: 'Seguridad' },
                { class: 'fa-download', name: 'Descargas' },
                { class: 'fa-file-zipper', name: 'Compresión' },
                { class: 'fa-play-circle', name: 'Multimedia' },
                { class: 'fa-pen-to-square', name: 'Edición' },
                { class: 'fa-box', name: 'Caja/App' },
                { class: 'fa-gears', name: 'Ajustes' },
                { class: 'fa-server', name: 'Servidor' },
                { class: 'fa-cloud', name: 'Nube' },
                { class: 'fa-code', name: 'Código' },
                { class: 'fa-bug', name: 'Errores' },
                { class: 'fa-bolt', name: 'Rápido' }
              ].map(icon => (
                <div key={icon.class} className="flex flex-col items-center p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                  <i className={`fa-solid ${icon.class} text-2xl text-blue-600 mb-3`}></i>
                  <span className="text-[10px] font-mono text-slate-400 text-center">{icon.class}</span>
                  <span className="text-xs font-bold text-slate-700 mt-1">{icon.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL PORTFOLIO */}
        {editPortfolio && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-10 rounded-3xl w-full max-w-2xl shadow-2xl my-8 animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-star text-blue-600"></i> Caso de Éxito
              </h2>
              <form onSubmit={handleSavePortfolio} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título del Proyecto</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPortfolio.title} onChange={e => setEditPortfolio({...editPortfolio, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL de la Imagen</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPortfolio.image} onChange={e => setEditPortfolio({...editPortfolio, image: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descripción Corta</label>
                  <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} value={editPortfolio.description} onChange={e => setEditPortfolio({...editPortfolio, description: e.target.value})} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Desafío</label>
                    <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={editPortfolio.challenge} onChange={e => setEditPortfolio({...editPortfolio, challenge: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Solución</label>
                    <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={editPortfolio.solution} onChange={e => setEditPortfolio({...editPortfolio, solution: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resultado/Impacto</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPortfolio.result} onChange={e => setEditPortfolio({...editPortfolio, result: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Guardar</button>
                  <button type="button" onClick={() => setEditPortfolio(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOTICIAS */}
        {editItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-10 rounded-3xl w-full max-w-2xl shadow-2xl my-8 animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-pen-to-square text-blue-600"></i> Editor de Contenido
              </h2>
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título de la Noticia</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL de la Imagen de Cabecera</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editItem.image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resumen (Aparece en la lista)</label>
                  <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} value={editItem.excerpt} onChange={e => setEditItem({...editItem, excerpt: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cuerpo Completo del Artículo</label>
                    <div className="flex gap-2 mb-1">
                      <button 
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('news-content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selected = text.substring(start, end) || 'texto';
                          const newText = text.substring(0, start) + `**${selected}**` + text.substring(end);
                          setEditItem({...editItem, fullContent: newText});
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                        title="Negrita"
                      >
                        <i className="fa-solid fa-bold"></i>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('news-content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selected = text.substring(start, end) || 'texto';
                          const newText = text.substring(0, start) + `_${selected}_` + text.substring(end);
                          setEditItem({...editItem, fullContent: newText});
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                        title="Itálica"
                      >
                        <i className="fa-solid fa-italic"></i>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('news-content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selected = text.substring(start, end) || 'texto';
                          const newText = text.substring(0, start) + `<u>${selected}</u>` + text.substring(end);
                          setEditItem({...editItem, fullContent: newText});
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                        title="Subrayado"
                      >
                        <i className="fa-solid fa-underline"></i>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('news-content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selected = text.substring(start, end) || 'descripción';
                          const newText = text.substring(0, start) + `![${selected}](https://...)` + text.substring(end);
                          setEditItem({...editItem, fullContent: newText});
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                        title="Imagen"
                      >
                        <i className="fa-solid fa-image"></i>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('news-content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selected = text.substring(start, end) || 'texto';
                          const newText = text.substring(0, start) + `[${selected}](https://...)` + text.substring(end);
                          setEditItem({...editItem, fullContent: newText});
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                        title="Enlace"
                      >
                        <i className="fa-solid fa-link"></i>
                      </button>
                    </div>
                  </div>
                  <textarea 
                    id="news-content"
                    required 
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans" 
                    rows={8} 
                    value={editItem.fullContent} 
                    onChange={e => setEditItem({...editItem, fullContent: e.target.value})} 
                  />
                  <p className="text-[9px] text-slate-400 mt-1 italic">Puedes usar formato Markdown para enriquecer el texto.</p>
                  
                  {/* Vista Previa en el Editor */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vista Previa</p>
                    <div className="prose prose-slate max-w-none text-sm markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {editItem.fullContent || '*Sin contenido*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Guardar Cambios</button>
                  <button type="button" onClick={() => setEditItem(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL APLICACIONES */}
        {editApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white p-10 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-box text-blue-600"></i> Gestionar Aplicación
              </h2>
              <form onSubmit={handleSaveApp} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                    <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editApp.name} onChange={e => setEditApp({...editApp, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                    <select 
                      className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                      value={editApp.category}
                      onChange={e => setEditApp({...editApp, category: e.target.value})}
                    >
                      <option value="utilidad">Utilidad</option>
                      <option value="multimedia">Multimedia</option>
                      <option value="seguridad">Seguridad</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL de Descarga</label>
                  <input type="url" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editApp.url} onChange={e => setEditApp({...editApp, url: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icono (FontAwesome class, ej: fa-box)</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editApp.icon} onChange={e => setEditApp({...editApp, icon: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descripción Corta</label>
                  <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={editApp.description} onChange={e => setEditApp({...editApp, description: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Guardar</button>
                  <button type="button" onClick={() => setEditApp(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL SERVICIOS */}
        {editService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white p-10 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-gears text-blue-600"></i> Ajustar Servicio
              </h2>
              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre del Servicio</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editService.title} onChange={e => setEditService({...editService, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Público Objetivo</label>
                  <select 
                    className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                    value={editService.category}
                    onChange={e => setEditService({...editService, category: e.target.value})}
                  >
                    <option value="hogar">Uso Residencial (Hogar)</option>
                    <option value="negocios">Uso Profesional (Negocios)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icono (FontAwesome class, ej: fa-wifi)</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editService.icon} onChange={e => setEditService({...editService, icon: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descripción del Servicio</label>
                  <textarea required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={editService.desc} onChange={e => setEditService({...editService, desc: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Sincronizar</button>
                  <button type="button" onClick={() => setEditService(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Descartar</button>
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
