import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

const Home: React.FC = () => {
  const [contact, setContact] = React.useState(storageService.getContact());

  React.useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'contact') {
        setContact(storageService.getContact());
      }
    };

    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  return (
    <div className="pt-16 bg-slate-50">
      {/* Premium Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <ScrollReveal variant="left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <i className="fa-solid fa-circle-check text-blue-400 animate-pulse"></i> SOPORTE REMOTO & AUTOMATIZACIÓN DE PROCESOS
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                  Consultoría y Soluciones <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Tecnológicas Premium
                  </span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
                  Ayudamos a pequeños negocios, estudios contables y profesionales independientes a estabilizar sus sistemas, erradicar fallas informáticas y automatizar el trabajo pesado. Soporte remoto inmediato sin complicaciones.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link to="/servicios" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all text-center">
                    Ver Soluciones & Abonos
                  </Link>
                  <Link to="/contacto" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all text-center">
                    Consultar Soporte Hoy
                  </Link>
                </div>
              </ScrollReveal>
            </div>
            
            <div className="lg:col-span-5 mt-12 lg:mt-0 relative">
              <ScrollReveal variant="right" delay={200}>
                {/* Hero Card Visual */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-slate-400">AGENCY_CONNECTED: TRUE</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">SLA Prioritario Activo</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                        H24
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Soporte Tecnológico Remoto</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Sistemas contables, Windows, Outlook, Office 365, etc.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-bold">
                        <i className="fa-solid fa-code"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Automatizaciones n8n / Low-Code</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Conectamos CRM, planillas de Google y llamadas automáticas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>STATUS: ALL OK</span>
                    <span>99.9% UPTIME</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">ESTRATEGIA OPERATIVA</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Tres Pilares para tu Estabilidad Digital</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">No arreglamos computadoras puntuales esperando a que fallen de nuevo; implementamos sistemas estables y preventivos.</p>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: 'fa-desktop', 
                title: '1. Soporte Técnico Remoto Profesional', 
                desc: 'Atención sumamente especializada en sistemas operativos Windows, Office, Outlook empresarial, problemas de redes locales y software contable. Solucionado en minutos de forma remota.',
                link: '/servicios'
              },
              { 
                icon: 'fa-bolt', 
                title: '2. Automatización de Procesos (n8n)', 
                desc: 'Eliminamos el trabajo de oficina manual e ineficiente. Conectamos tus formularios web, envíos automáticos de WhatsApp, planillas de Google Docs y CRM en un flujo inteligente sin programar.',
                link: '/automatizaciones'
              },
              { 
                icon: 'fa-file-invoice-dollar', 
                title: '3. Planes Mensuales de Soporte', 
                desc: 'Abonos de soporte con acuerdos claros. Garantizamos disponibilidad, copias de seguridad monitoreadas, soporte remoto preferencial de primer nivel y mantenimiento preventivo continuo.',
                link: '/servicios'
              }
            ].map((p, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="up">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <i className={`fa-solid ${p.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{p.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{p.desc}</p>
                  </div>
                  <Link to={p.link} className="text-blue-600 font-bold text-xs flex items-center gap-1.5 group-hover:gap-2.5 transition-all mt-auto pt-4 border-t border-slate-200/40">
                    Saber Más <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work / Operational Boundaries (Filter Clients) */}
      <section className="py-24 bg-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="lg:w-1/2">
              <ScrollReveal variant="left">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full inline-block">NUESTRO FILTRO DE CALIDAD</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                  Una Metodología para Clientes que Valoran su Tiempo
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                  Para brindar un servicio de altísima calidad y con respuesta prioritarias respetando cada acuerdo comercial, aplicamos reglas estrictas en nuestra forma de operar:
                </p>
                
                <div className="space-y-4">
                  {[
                    { title: 'Soporte Bajo Agenda / Abono Mensual', desc: 'Priorizamos de forma absoluta a los clientes abonados. Los incidentes imprevistos de fuera de abono se atienden estrictamente bajo agenda y turno técnico disponible.' },
                    { title: 'Soporte Remoto Primero', desc: 'El 95% de las incidencias críticas se solucionan de forma remota en minutos, eliminando demoras de traslado y reduciendo costos innecesarios para tu negocio.' },
                    { title: 'Canal Único con Validación WhatsApp', desc: 'No atendemos urgencias ruidosas e informales. El soporte se registra de forma estructurada con nuestro formulario web y número corporativo certificado.' }
                  ].map((rule, sidx) => (
                    <div key={sidx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{rule.title}</h4>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:w-1/2 flex justify-center w-full">
              <ScrollReveal variant="right" delay={200}>
                {/* Visual Card detailing engagement rules */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 max-w-md shadow-2xl relative">
                  <div className="text-xs text-slate-500 font-mono mb-4 border-b border-slate-800 pb-3 uppercase tracking-widest">
                    REQUISITOS DEL SERVICIO
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-bold text-amber-500 tracking-wider font-mono">PAGO SEGURO</span>
                      <h4 className="font-bold text-slate-200 text-xs mt-1">Facturación Organizada</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Los abonos mensuales se facturan por adelantado del 1 al 5 de cada mes para garantizar el canal priorizado de soporte técnico.</p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-bold text-blue-400 tracking-wider font-mono">REMOTE CONNECTION</span>
                      <h4 className="font-bold text-slate-200 text-xs mt-1">Conexión Segura vía AnyDesk / RustDesk</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Solo requerimos tu ID temporal. No almacenamos credenciales ocultas para asegurar una protección intachable y transparencia total.</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Link to="/contacto" className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-xs text-center hover:bg-slate-100 transition-colors">
                      Unirse como Cliente Autorizado
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="scale">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <i className="fa-solid fa-code text-9xl"></i>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-4">CHARLEMOS SIN COMPROMISO</span>
               <h2 className="text-3xl font-black mb-4">¿Quieres automatizar tus tareas de oficina o necesitas un abono técnico estable?</h2>
               <p className="text-base sm:text-lg opacity-90 mb-10 max-w-2xl mx-auto">
                 Definamos una agenda clara. Te ayudaremos a optimizar tu infraestructura sin traslados lentos ni costos sorpresa.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link to="/contacto" className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-slate-50 transition-all shadow-md">
                   Agendar Asesoría Técnica
                 </Link>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
