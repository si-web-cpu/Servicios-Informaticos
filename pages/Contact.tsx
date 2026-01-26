
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState(storageService.getContact());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'contact') setContactInfo(storageService.getContact());
      if (event.detail.key === 'settings') setSettings(storageService.getSettings());
    };
    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (settings.formEndpoint && settings.formEndpoint.trim() !== '') {
        // ENVÍO REAL si el endpoint está configurado en el Admin
        const response = await fetch(settings.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al enviar. Verifica tu configuración.');
      } else {
        // MODO SIMULACIÓN si no hay endpoint (útil para testing)
        console.warn("Servicios Informáticos: Formulario operando en modo simulación (sin endpoint configurado)");
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("Lo sentimos, hubo un error técnico al procesar el envío. Por favor contáctanos vía WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <div className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ScrollReveal className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Ponte en Contacto</h1>
          <p className="text-slate-600 text-lg">Estamos listos para resolver tus dudas técnicas.</p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <ScrollReveal variant="left">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-phone"></i></div>
                  <div><h4 className="font-bold text-slate-900">Teléfono</h4><p className="text-slate-600">{contactInfo.phone}</p></div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-envelope"></i></div>
                  <div><h4 className="font-bold text-slate-900">Email</h4><p className="text-slate-600">{contactInfo.email}</p></div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="left" delay={200}>
              <div className="bg-blue-600 p-8 rounded-3xl text-white">
                <h4 className="text-xl font-bold mb-4">Horario de Atención</h4>
                <ul className="space-y-3 opacity-90 text-sm">
                  <li className="flex justify-between border-b border-white/20 pb-2"><span>Lun a Vie</span><span>{contactInfo.hours.week}</span></li>
                  <li className="flex justify-between border-b border-white/20 pb-2"><span>Sábados</span><span>{contactInfo.hours.sat}</span></li>
                  <li className="flex justify-between"><span>Domingos</span><span>{contactInfo.hours.sun}</span></li>
                </ul>
                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="mt-8 block text-center bg-white text-blue-600 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors">WhatsApp Directo</a>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            {!isSubmitted ? (
              <ScrollReveal variant="right" delay={300}>
                <div className="bg-white p-10 rounded-3xl shadow-xl border relative">
                  {!settings.formEndpoint && (
                    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Modo Simulación Activo (Configura el endpoint en el Admin para recibir correos)
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium flex items-center gap-3">
                      <i className="fa-solid fa-circle-exclamation text-lg"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Juan Pérez" 
                          required 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Correo Electrónico</label>
                        <input 
                          type="email" 
                          placeholder="tu@email.com" 
                          required 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Asunto</label>
                      <input 
                        type="text" 
                        placeholder="¿En qué podemos ayudarte?" 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mensaje Detallado</label>
                      <textarea 
                        rows={5} 
                        placeholder="Cuéntanos sobre el problema de tu equipo..." 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
                        value={formData.message} 
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                        isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i>
                          Enviar Consulta
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner"><i className="fa-solid fa-check"></i></div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">¡Mensaje Recibido!</h2>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">Gracias <strong>{formData.name}</strong>, hemos recibido tu consulta. Te responderemos a la brevedad.</p>
                <button onClick={resetForm} className="text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto">
                  <i className="fa-solid fa-arrow-rotate-left"></i> Enviar otro mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
