
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'services' | 'planes' | 'contact' | 'settings' | 'stats' | 'apps' | 'portfolio' | 'icons' | 'emails'>('news');
  
  // Feedback State
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data States
  const [news, setNews] = useState(storageService.getNews());
  const [services, setServices] = useState(storageService.getServices());
  const [planes, setPlanes] = useState(() => storageService.getPlanes());
  const [emails, setEmails] = useState<string[]>(() => storageService.getEmails());
  const [newEmailInput, setNewEmailInput] = useState('');
  const [contact, setContact] = useState(storageService.getContact());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [apps, setApps] = useState(storageService.getApps());
  const [portfolio, setPortfolio] = useState(storageService.getPortfolio());
  const [rawVisits, setRawVisits] = useState<number | null>(null);

  // Form States
  const [editItem, setEditItem] = useState<any>(null);
  const [editService, setEditService] = useState<any>(null);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [editApp, setEditApp] = useState<any>(null);
  const [editPortfolio, setEditPortfolio] = useState<any>(null);

  const BASE_VISITS = 1248;

  useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'emails') {
        const freshEmails = storageService.getEmails();
        setEmails(freshEmails);
      }
    };
    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase no está configurado (VITE_FIREBASE_API_KEY no es válida). El inicio de sesión con Google estará desactivado.");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const allowedEmails = storageService.getEmails();
      if (user && user.email && allowedEmails.includes(user.email.toLowerCase().trim())) {
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
    if (!isFirebaseConfigured) {
      alert(
        '⚠️ Configuración de Firebase requerida\n\n' +
        'El inicio de sesión de Google requiere que configures tus credenciales de Firebase válidas.\n\n' +
        'Por favor, asegúrate de haber cargado VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN y demás variables en la configuración del servidor, o haber hecho la provisión correcta. Mientras tanto, puedes acceder con la contraseña de Administración local para probar las herramientas.'
      );
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const allowedEmails = storageService.getEmails().map((e: string) => e.toLowerCase().trim());
      if (!result.user.email || !allowedEmails.includes(result.user.email.toLowerCase().trim())) {
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

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    simulateSave(async () => {
      let updated;
      const benefits = editPlan.benefitsString
        ? editPlan.benefitsString.split('\n').map((b: string) => b.trim()).filter((b: string) => b !== '')
        : [];
      
      const preparedPlan = {
        name: editPlan.name,
        slug: editPlan.slug || editPlan.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-"),
        tagline: editPlan.tagline,
        price: editPlan.price,
        currency: editPlan.currency || 'USD',
        frequency: editPlan.frequency || 'mes',
        benefits: benefits,
        limits: editPlan.limits,
        sla: editPlan.sla,
        badge: editPlan.badge || 'Básico',
        isPopular: editPlan.isPopular === true || editPlan.isPopular === 'true'
      };

      if (planes.some((p: any) => p.slug === preparedPlan.slug)) {
        updated = planes.map((p: any) => p.slug === preparedPlan.slug ? preparedPlan : p);
      } else {
        updated = [...planes, preparedPlan];
      }
      
      setPlanes(updated);
      await storageService.savePlanes(updated);
      setEditPlan(null);
    }, 'Abono mensual guardado exitosamente');
  };

  const handleDeletePlan = (slug: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este abono mensual?')) return;
    simulateSave(async () => {
      const updated = planes.filter((p: any) => p.slug !== slug);
      setPlanes(updated);
      await storageService.savePlanes(updated);
    }, 'Abono mensual eliminado');
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim()) return;
    const cleanEmail = newEmailInput.toLowerCase().trim();
    if (emails.includes(cleanEmail)) {
      showFeedback('Ese correo ya está autorizado', 'error');
      return;
    }
    simulateSave(async () => {
      const updated = [...emails, cleanEmail];
      setEmails(updated);
      await storageService.saveEmails(updated);
      setNewEmailInput('');
    }, 'Correo autorizado añadido');
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    const cleanEmail = emailToDelete.toLowerCase().trim();
    if (cleanEmail === 'kakarotto.jj@gmail.com') {
      alert('No puedes eliminar el correo del propietario principal de la cuenta.');
      return;
    }
    if (!window.confirm(`¿Seguro que deseas revocar el acceso para ${emailToDelete}?`)) return;
    simulateSave(async () => {
      const updated = emails.filter((e: string) => e.toLowerCase().trim() !== cleanEmail);
      setEmails(updated);
      await storageService.saveEmails(updated);
    }, 'Acceso revocado exitosamente');
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

          {isFirebaseConfigured ? (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-xs text-red-800 leading-relaxed">
                <i className="fa-solid fa-triangle-exclamation mr-1 text-red-600"></i>
                <strong className="text-red-700">Atención Crítica:</strong> Para guardar cambios en la base de datos, <strong>DEBES</strong> iniciar sesión con tu cuenta de Google autorizada. El acceso por contraseña es solo de lectura.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 leading-relaxed">
                <i className="fa-solid fa-circle-info mr-1 text-amber-600"></i>
                <strong>Google Auth no configurado:</strong> El proyecto no tiene credenciales de Firebase configuradas aún (VITE_FIREBASE_API_KEY no detectado). Puedes acceder en modo administrador local con contraseña para probar.
              </p>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-3 mb-6 ${
              isFirebaseConfigured 
                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' 
                : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className={`w-5 h-5 ${!isFirebaseConfigured ? 'grayscale opacity-50' : ''}`} />
            {isFirebaseConfigured ? 'Acceder con Google' : 'Google Auth inactivo'}
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
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Modo de Solo Lectura</p>
                <p className="text-xs text-red-700">
                  {isFirebaseConfigured 
                    ? "Has accedido con contraseña, pero necesitas iniciar sesión con Google para guardar cambios."
                    : "Para guardar cambios reales en bases de datos requerirás configurar Google Auth / Firebase en tu proyecto."}
                </p>
              </div>
            </div>
            <button 
              onClick={handleGoogleLogin} 
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isFirebaseConfigured
                  ? 'bg-white text-red-600 border-red-100 hover:bg-red-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              {isFirebaseConfigured ? 'Vincular Google' : 'Google Auth pendiente'}
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
          {(() => {
            const isOwner = currentUser && currentUser.email && currentUser.email.toLowerCase().trim() === 'kakarotto.jj@gmail.com';
            const tabsList = ['news', 'services', 'planes', 'apps', 'portfolio', 'contact', 'settings', 'stats', 'icons'];
            if (isOwner) {
              tabsList.push('emails');
            }
            return tabsList.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-6 font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'news' ? 'Noticias' : tab === 'services' ? 'Servicios' : tab === 'planes' ? 'Abonos Mensuales' : tab === 'apps' ? 'Apps' : tab === 'portfolio' ? 'Casos Éxito' : tab === 'contact' ? 'Contacto' : tab === 'settings' ? 'Ajustes' : tab === 'stats' ? 'Estadísticas' : tab === 'emails' ? 'Accesos Google' : 'Iconos'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
              </button>
            ));
          })()}
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
            <button onClick={() => setEditService({ title: '', category: 'remoto', icon: 'fa-laptop-medical', desc: '', info: '' })} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Añadir Servicio
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Servicio</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Categoría</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Información / SLA Corto</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <i className={`fa-solid ${s.icon} text-slate-400 text-xs`}></i>
                          {s.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 max-w-sm line-clamp-1">{s.desc}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.category === 'remoto' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {s.category === 'remoto' ? 'Atención Remota' : 'Sistemas & Backups'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs italic text-slate-500 font-medium">{s.info || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-3 text-xs sm:text-sm">
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

        {activeTab === 'planes' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditPlan({ name: '', slug: '', tagline: '', price: '', currency: 'USD', frequency: 'mes', benefitsString: '', limits: '', sla: '', badge: '', isPopular: false })} 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Añadir Abono Mensual
            </button>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700">Abono/Plan</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Etiqueta/Badge</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Precio (USD)</th>
                    <th className="px-6 py-4 font-bold text-slate-700">Popular</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planes.map((p: any) => (
                    <tr key={p.slug} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded font-bold uppercase">{p.badge || 'Básico'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold font-sm text-slate-800">${p.price} {p.currency}/{p.frequency}</span>
                      </td>
                      <td className="px-6 py-4 uppercase">
                        {p.isPopular ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[9px]">Popular *</span>
                        ) : (
                          <span className="text-slate-450 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 text-xs sm:text-sm">
                        <button 
                          onClick={() => setEditPlan({ ...p, benefitsString: p.benefits ? p.benefits.join('\n') : '' })} 
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeletePlan(p.slug)} 
                          className="text-red-600 font-bold hover:underline"
                        >
                          Borrar
                        </button>
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
                <label className="block text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Método de Contacto</label>
                <select 
                  className="w-full border p-4 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-slate-900 transition-all font-semibold text-slate-700"
                  value={settings.formType || 'standard'}
                  onChange={e => setSettings({...settings, formType: e.target.value})}
                >
                  <option value="standard">Estándar JSON (Formspree / Webhook / n8n / Local)</option>
                  <option value="google_forms">Google Forms (Directo a Google Sheets)</option>
                </select>
              </div>

              {(settings.formType === 'standard' || !settings.formType) && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="block text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">URL de Endpoint (Formspree / n8n / Webhook)</label>
                  <input 
                    type="text" 
                    className="w-full border p-4 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                    value={settings.formEndpoint || ''} 
                    onChange={e => setSettings({...settings, formEndpoint: e.target.value})} 
                    placeholder="https://formspree.io/f/tu-id-aqui o http://tu-servidor:5678/webhook/..."
                  />
                  <p className="text-[11px] text-slate-400 ml-1">Envía los datos del formulario como un objeto JSON.</p>
                </div>
              )}

              {settings.formType === 'google_forms' && (
                <div className="space-y-6 border-l-2 border-blue-500 pl-4 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Configuración de Google Forms</h3>
                    <p className="text-xs text-slate-500">Completa con los datos obtenidos del enlace prellenado (Prefilled Link).</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">URL de Recolección (formResponse)</label>
                    <input 
                      type="text" 
                      className="w-full border p-4 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      value={settings.googleFormUrl || ''} 
                      onChange={e => setSettings({...settings, googleFormUrl: e.target.value})} 
                      placeholder="https://docs.google.com/forms/u/0/d/e/1FAIpQLSf.../formResponse"
                    />
                    <p className="text-[10px] text-slate-400">Debe terminar con <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/formResponse</code> en lugar de <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/viewform</code>.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Nombre" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntryName || ''} 
                        onChange={e => setSettings({...settings, googleEntryName: e.target.value})} 
                        placeholder="entry.123456789"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Email" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntryEmail || ''} 
                        onChange={e => setSettings({...settings, googleEntryEmail: e.target.value})} 
                        placeholder="entry.987654321"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Teléfono" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntryPhone || ''} 
                        onChange={e => setSettings({...settings, googleEntryPhone: e.target.value})} 
                        placeholder="entry.111222333"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Prefiere WhatsApp" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntryWhatsapp || ''} 
                        onChange={e => setSettings({...settings, googleEntryWhatsapp: e.target.value})} 
                        placeholder="entry.444555666"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Asunto" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntrySubject || ''} 
                        onChange={e => setSettings({...settings, googleEntrySubject: e.target.value})} 
                        placeholder="entry.555555555"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Campo "Mensaje" (entry.X)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={settings.googleEntryMessage || ''} 
                        onChange={e => setSettings({...settings, googleEntryMessage: e.target.value})} 
                        placeholder="entry.999999999"
                      />
                    </div>
                  </div>
                </div>
              )}

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

        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Formulario Agregar */}
              <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-user-plus text-blue-600"></i> Autorizar Nuevo Correo
                </h3>
                <p className="text-slate-500 text-xs mb-6">
                  Cualquier persona con el correo de Google ingresado aquí podrá loguearse con su cuenta y realizar cambios en el portal.
                </p>
                <form onSubmit={handleAddEmail} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico de Google</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        required 
                        className="flex-grow border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                        placeholder="ejemplo@gmail.com o corporativo"
                        value={newEmailInput}
                        onChange={e => setNewEmailInput(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors text-nowrap disabled:opacity-55"
                      >
                        {isSaving ? 'Guardando...' : 'Autorizar'}
                      </button>
                    </div>
                  </div>
                </form>
                
                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100/60 flex gap-3 text-amber-800 text-xs">
                  <i className="fa-solid fa-shield-halved text-lg text-amber-600 shrink-0 mt-0.5"></i>
                  <p className="leading-relaxed font-medium">
                    <strong className="block mb-0.5">Filtro de Seguridad Especial:</strong> 
                    Solo tú (como propietario principal con el correo <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">kakarotto.jj@gmail.com</code>) tienes acceso para visualizar esta pestaña de administración y gestionar quién más puede entrar.
                  </p>
                </div>
              </div>

              {/* Listado de Correos */}
              <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-users-gear text-blue-600"></i> Administradores de Google con Acceso ({emails.length})
                </h3>
                
                <div className="divide-y divide-slate-100">
                  {emails.map((email: string) => {
                    const isMainOwner = email.toLowerCase().trim() === 'kakarotto.jj@gmail.com';
                    return (
                      <div key={email} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMainOwner ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            <i className={isMainOwner ? "fa-solid fa-crown text-xs" : "fa-solid fa-user text-xs"}></i>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">{email}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                              {isMainOwner ? 'Propietario Principal' : 'Administrador Auxiliar'}
                            </p>
                          </div>
                        </div>
                        
                        {!isMainOwner ? (
                          <button 
                            type="button" 
                            onClick={() => handleDeleteEmail(email)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors flex flex-wrap items-center justify-center shrink-0"
                            title="Eliminar acceso"
                          >
                            <i className="fa-solid fa-trash-can text-sm"></i>
                          </button>
                        ) : (
                          <span className="px-2 py-1 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-lg select-none">
                            Fijo
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre el Servicio</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editService.title} onChange={e => setEditService({...editService, title: e.target.value})} placeholder="Ej: Soporte Windows & Mac" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Público y Tipo de Servicio</label>
                  <select 
                    className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                    value={editService.category}
                    onChange={e => setEditService({...editService, category: e.target.value})}
                  >
                    <option value="remoto">Atención Remota (💻 Soporte Remoto)</option>
                    <option value="sistemas">Sistemas & Infraestructura (⚙️ Sistemas & Backups)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icono (FontAwesome class, ej: fa-laptop-medical)</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editService.icon} onChange={e => setEditService({...editService, icon: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Información Corta de Destacado / Meta de SLA</label>
                  <input type="text" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editService.info || ''} onChange={e => setEditService({...editService, info: e.target.value})} placeholder="Ej: Respuesta remota en minutos." />
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

        {/* MODAL PLANES / ABONOS MENSUALES */}
        {editPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-8 sm:p-10 rounded-3xl w-full max-w-2xl shadow-2xl my-8 animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-file-invoice-dollar text-blue-600"></i> Configurar Plan Mensual
              </h2>
              <form onSubmit={handleSavePlan} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre del Plan</label>
                    <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.name} onChange={e => setEditPlan({...editPlan, name: e.target.value})} placeholder="Ej: Control Total" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Badge / Etiqueta</label>
                    <input type="text" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.badge} onChange={e => setEditPlan({...editPlan, badge: e.target.value})} placeholder="Ej: Plan Inicial / Recomendado" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Eslogan / Copia del Plan</label>
                  <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.tagline} onChange={e => setEditPlan({...editPlan, tagline: e.target.value})} placeholder="Ej: Ideal para asegurar y monitorear hasta 10 terminales" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Precio</label>
                    <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.price} onChange={e => setEditPlan({...editPlan, price: e.target.value})} placeholder="Ej: 50.000 / Consultar" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Moneda</label>
                    <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.currency} onChange={e => setEditPlan({...editPlan, currency: e.target.value})} placeholder="Ej: ARS / USD" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Frecuencia</label>
                    <input type="text" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.frequency} onChange={e => setEditPlan({...editPlan, frequency: e.target.value})} placeholder="Ej: mes" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Límites / Cobertura</label>
                    <input type="text" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.limits} onChange={e => setEditPlan({...editPlan, limits: e.target.value})} placeholder="Ej: Hasta 10 terminales + 1 Servidor" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SLA / Compromiso</label>
                    <input type="text" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={editPlan.sla} onChange={e => setEditPlan({...editPlan, sla: e.target.value})} placeholder="Ej: Soporte prioritario crítico < 2h" />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2 bg-slate-50 px-4 rounded-xl border">
                  <input 
                    type="checkbox" 
                    id="isPopular" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                    checked={editPlan.isPopular} 
                    onChange={e => setEditPlan({...editPlan, isPopular: e.target.checked})} 
                  />
                  <label htmlFor="isPopular" className="text-xs font-bold text-slate-700 select-none cursor-pointer">Destacar como el plan "MÁS POPULAR" (Borde color azul llamativo)</label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Beneficios / Servicios Incluidos (Uno por párrafo/línea)</label>
                  <textarea 
                    required 
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-y" 
                    rows={6} 
                    value={editPlan.benefitsString} 
                    onChange={e => setEditPlan({...editPlan, benefitsString: e.target.value})} 
                    placeholder="Monitoreo 24/7 activo&#15;Copias de seguridad automáticas diarias&#15;Soporte remoto para emergencias ilimitado"
                  />
                  <p className="text-[10px] text-slate-400 italic">Cada salto de línea representa un casillero verde de beneficio en la tabla comparativa.</p>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-grow bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Guardar Plan</button>
                  <button type="button" onClick={() => setEditPlan(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
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
