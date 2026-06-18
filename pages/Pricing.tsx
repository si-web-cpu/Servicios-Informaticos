import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

const Pricing: React.FC = () => {
  const [planes, setPlanes] = useState<any[]>(() => storageService.getPlanes());
  const [activeCategory, setActiveCategory] = useState<'hogar' | 'negocio'>('hogar');
  const [contact, setContact] = useState<any>(() => storageService.getContact());

  useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'planes') {
        setPlanes(storageService.getPlanes());
      }
      if (event.detail.key === 'contact') {
        setContact(storageService.getContact());
      }
    };

    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  // Helper helper to build direct WhatsApp links with customized context messages
  const getWhatsAppUrl = (planName: string, price: string) => {
    const cleanPhone = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';
    const message = `Hola! Me interesa solicitar el "${planName}" por $${price}/mes para mi hogar u oficina.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filter plans based on categories
  const hogarPlanes = planes.filter(p => p.slug && p.slug.includes('hogar'));
  const negocioPlanes = planes.filter(p => p.slug && (p.slug.includes('negocio') || p.slug.includes('comercios') || p.slug.includes('contable') || p.slug.includes('profesional')));

  const activePlanes = activeCategory === 'hogar' ? hogarPlanes : negocioPlanes;

  return (
    <div id="pricing-page" className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
            MÁXIMA TRANSPARENCIA
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight leading-tight">
            Planes y Precios Claros
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
            Sin contratos de permanencia obligatoria, sin sorpresas en tu factura mensual. Elige el abono que mejor se adapte a tu ritmo de trabajo o tu hogar.
          </p>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </ScrollReveal>

        {/* Category Toggles */}
        <ScrollReveal variant="scale" className="flex justify-center">
          <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 border border-slate-300/30">
            <button
              id="category-hogar-btn"
              onClick={() => setActiveCategory('hogar')}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'hogar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <i className="fa-solid fa-house"></i>
              🏠 Para el Hogar
            </button>
            <button
              id="category-negocio-btn"
              onClick={() => setActiveCategory('negocio')}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'negocio'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <i className="fa-solid fa-briefcase"></i>
              💼 Para Profesionales y Negocios
            </button>
          </div>
        </ScrollReveal>

        {/* Planes list cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
          {activePlanes.map((pla, idx) => {
            const isHogar = pla.slug && pla.slug.includes('hogar');
            
            return (
              <ScrollReveal 
                key={pla.slug || idx} 
                delay={idx * 150} 
                variant="up"
                className={`flex flex-col h-full bg-white rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
                  pla.isPopular 
                    ? 'border-blue-500 ring-2 ring-blue-600 shadow-xl shadow-blue-105' 
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {pla.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-6 rounded-bl-2xl">
                    RECOMENDADO
                  </div>
                )}

                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-blue-600 bg-blue-50 rounded border border-blue-100 uppercase tracking-wider">
                      {isHogar ? '🏠 Hogar' : '💼 Negocio'}
                    </span>
                    {pla.badge && (
                      <span className="text-[10px] text-slate-450 font-bold uppercase">{pla.badge}</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {pla.name}
                  </h3>
                  
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed min-h-[38px]">
                    {pla.tagline}
                  </p>

                  <div className="my-6 bg-slate-50 p-4 rounded-2xl border border-slate-150/60">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-black text-blue-600">${pla.price}</span>
                      <span className="text-slate-450 text-xs font-semibold ml-1.5">/ {pla.frequency}</span>
                    </div>
                    {pla.limits && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-0.5">VALOR PERCIBIDO:</span>
                        <p className="text-slate-700 text-xs font-extrabold italic leading-snug">
                          "{pla.limits}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mt-6">
                    <p className="text-[9px] font-extrabold tracking-widest text-slate-400 uppercase">¿Qué incluye el plan?</p>
                    {pla.benefits && pla.benefits.map((ben: string, bidx: number) => (
                      <div key={bidx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                        <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 shrink-0"></i>
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 pt-0 mt-auto">
                  <div className="border-t border-slate-100 pt-6">
                    {pla.sla && (
                      <p className="text-[10px] text-slate-400 mb-4 text-center font-mono">
                        ⏱️ {pla.sla}
                      </p>
                    )}
                    <a
                      href={getWhatsAppUrl(pla.name, pla.price)}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full py-4 rounded-xl text-xs font-bold block text-center transition-all cursor-pointer ${
                        pla.isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-505 text-white shadow-md shadow-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <i className="fa-brands fa-whatsapp mr-1.5 text-sm inline-block"></i>
                      Solicitar este Abono
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Nota sobre alcance de soporte remoto y presencial */}
        <ScrollReveal variant="up" className="max-w-4xl mx-auto">
          <div className="bg-slate-150/40 border-l-4 border-blue-500 p-5 rounded-r-2xl flex items-start gap-4">
            <div className="text-blue-600 mt-0.5 shrink-0">
              <i className="fa-solid fa-circle-info text-lg"></i>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-800 tracking-wide uppercase">
                Modalidad del Servicio
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                <span className="text-slate-900 font-extrabold block sm:inline">Soporte prioritariamente remoto.</span>
                <span className="block sm:inline sm:ml-1">Si el problema requiere intervención física, se coordina una visita presencial según disponibilidad y ubicación.</span>
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Central comparison table in a beautiful responsive layout */}
        <ScrollReveal className="pt-16 border-t border-slate-200/80 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
              COMPARATIVA DIRECTA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 tracking-tight">
              Tabla Comparativa de Abonos Negocio
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
              Visualiza de forma directa qué características resuelven tus requerimientos en cada nivel.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-900 text-white border-b border-slate-800">
                    <th className="px-6 py-5 font-bold text-sm tracking-wide text-center bg-blue-950/30">Esencial</th>
                    <th className="px-6 py-5 font-bold text-sm tracking-wide text-center bg-blue-950/50">Plus</th>
                    <th className="px-6 py-5 font-bold text-sm tracking-wide text-center bg-blue-950/70">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-xs font-black text-slate-800">Desde $39.900</td>
                    <td className="px-6 py-4 text-center text-xs font-black text-slate-800 bg-slate-50/20">Desde $69.900</td>
                    <td className="px-6 py-4 text-center text-xs font-black text-blue-600 font-mono bg-slate-50/40">Desde $119.900</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-xs text-slate-650">Soporte remoto</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-650 bg-slate-50/20">Todo Esencial</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-650 bg-slate-50/40">Todo Plus</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-xs text-slate-650">WhatsApp prioritario</td>
                    <td className="px-6 py-4 text-center text-xs text-emerald-600 font-bold bg-slate-50/20">Copias de seguridad</td>
                    <td className="px-6 py-4 text-center text-xs text-emerald-605 font-bold bg-slate-50/40">Automatizaciones</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-xs text-slate-650">Outlook y sistemas</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-650 bg-slate-50/20">Hasta 3 equipos</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-650 bg-slate-50/40">Atención preferencial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Professional Handshake Assistance disclaimer */}
        <ScrollReveal className="p-8 bg-amber-50 border border-amber-200 rounded-[2.5rem] max-w-4xl mx-auto flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <i className="fa-solid fa-handshake text-xl"></i>
          </div>
          <div>
            <h4 className="font-extrabold text-amber-900 text-sm">¿Requieres un convenio diseñado a medida?</h4>
            <p className="text-amber-850 text-xs mt-1 leading-relaxed">
              Para oficinas de más de 3 puestos, clínicas dentales o estudios que necesitan asistencia híbrida semestral programada, generamos convenios corporativos personalizados. Escríbenos directamente para que podamos relevar tu infraestructura.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default Pricing;
