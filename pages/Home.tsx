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

  // Helper helper to build direct WhatsApp links with customized context messages
  const getWhatsAppUrl = (message: string) => {
    const cleanPhone = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="pt-16 bg-slate-50">
      {/* Top Real-time Dynamic Announcement Bar */}
      <div className="bg-blue-600 text-white text-xs py-2.5 px-4 text-center font-semibold tracking-wide flex items-center justify-center gap-2 relative z-20">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>💻 <b>Soporte Remoto Inmediato Activo</b>: Resolvemos tus fallas directamente en pantalla usando AnyDesk o RustDesk.</span>
      </div>

      {/* Premium Hero Section focused on solutions over technical jargon */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-955 text-white">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal variant="left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                  <i className="fa-solid fa-shield-halved text-emerald-400"></i> SOPORTE INFORMÁTICO DE CONFIANZA
                </span>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mt-2">
                  ¿Tus computadoras fallan y{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
                    pierdes horas
                  </span>{' '}
                  de trabajo?
                </h1>
                
                <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed mt-4">
                  Solucionamos problemas de Windows, fallos de Outlook, caídas de sistemas contables y lentitud de forma <b>100% remota</b>. Rápido, sin tecnicismos confusos y sin moverte de tu escritorio.
                </p>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={getWhatsAppUrl("Hola! Me urge soporte técnico remoto para mis equipos de trabajo.")}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-center transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/40"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    Pedir Soporte Técnico Remoto
                  </a>
                  <Link 
                    to="/servicios" 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2"
                  >
                    Ver Abonos Mensuales
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>

                {/* Micro social proof anchors */}
                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left text-blue-500"></i> SLA Crítico &lt; 2 Horas
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-shield-cat text-emerald-400"></i> Conexión Encriptada Segura
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-check-double text-blue-400"></i> +20 Oficinas y Estudios Protegidos
                  </span>
                </div>
              </ScrollReveal>
            </div>
            
            <div className="lg:col-span-5 mt-12 lg:mt-0 relative w-full">
              <ScrollReveal variant="right" delay={200}>
                {/* Visual Status Console emphasizing uptime, speed, and simple clarity */}
                <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-slate-400">SOPORTE_ONLINE</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                    <i className="fa-solid fa-headset text-blue-405"></i> Cola de Soporte Técnico
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider font-mono">ASISTENCIA EN PANTALLA</span>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">ACTIVA</span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">Conexión con AnyDesk / RustDesk</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Tú nos dictas la clave temporal y ves en vivo cómo reparamos el sistema. Tú tienes el control absoluto en todo momento.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">EFICIENCIA OPERATIVA</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">24H MONITOREO</span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">Abonos Preventivos Mensuales</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Protección constante, copias contables automáticos en la nube y configuración de redes para evitar que vuelvas a pararte.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>MÁXIMA PRIVACIDAD</span>
                    <span>ADMIN_SLA: ACTIVO</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Empathy Section: The Problem Canvas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block">SITUACIONES CRÍTICAS</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
              ¿Tu tecnología facilita tu día o te llena de frustraciones?
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-3">
              Un negocio parado es dinero y clientes perdidos. Si experimentas alguno de estos problemas, no tienes por qué seguir sufriéndolos solo.
            </p>
            <div className="w-12 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-gauge-high',
                title: 'La computadora tarda una eternidad',
                desc: 'Esperar minutos a que cargue Windows, se abran las planillas o abra tu programa de gestión ralentiza todo el día.'
              },
              {
                icon: 'fa-envelope-circle-check',
                title: 'Outlook y correos rotos',
                desc: 'Correos que no salen, historial que desaparece o errores persistentes que impiden responder cotizaciones críticas.'
              },
              {
                icon: 'fa-landmark-flag',
                title: 'Páginas impositivas y de AFIP no cargan',
                desc: 'Conflictos de certificados de seguridad, firmas electrónicas no válidas y errores del navegador en plazos clave del mes.'
              },
              {
                icon: 'fa-copy',
                title: '¿Perdés horas haciendo tareas repetitivas?',
                desc: 'Copiar y pegar datos entre sistemas, procesar presupuestos a mano o cargar cobros en múltiples sitios te quita horas valiosas.'
              },
              {
                icon: 'fa-clock',
                title: 'Tu soporte actual demora demasiado',
                desc: 'Llamas por una emergencia y el soporte técnico tarda días en aparecer o te deja sin respuesta mientras tu negocio sigue parado.'
              },
              {
                icon: 'fa-shield-heart',
                title: '¿Qué pasaría si mañana perdieras toda tu información?',
                desc: 'Falta de copias de seguridad automáticas de tus archivos contables, contratos y bases de datos impositivas importantes.'
              }
            ].map((p, index) => (
              <ScrollReveal key={index} delay={index * 100} variant="up">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/55 hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-lg mb-5">
                    <i className={`fa-solid ${p.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{p.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section: Direct Benefits & Transparent Approach */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">NUESTRA SOLUCIÓN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
              Soporte Remoto Inmediato para estar Siempre Operativo
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-3">
              No esperes visitas lentas que te interrumpan. Solucionamos casi todo directamente en tu pantalla para que sigas trabajando.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: 'fa-headset',
                title: 'Asistencia Remota Inmediata',
                desc: 'Nos conectamos en segundos mediante AnyDesk o RustDesk de forma transparente. El 95% de los problemas lógicos se corrigen en la misma llamada.',
                badge: 'Resolución Rápida'
              },
              {
                icon: 'fa-laptop-code',
                title: 'Mantenimiento Preventivo Integral',
                desc: 'Recuperamos el rendimiento de equipos lentos, eliminamos problemas acumulados y reducimos fallas antes de que afecten tu trabajo.',
                badge: 'Vida Útil'
              },
              {
                icon: 'fa-calculator',
                title: 'Entornos de Trabajo para Estudios Contables',
                desc: 'Experiencia y soporte específico en herramientas clave: aplicativos SIAP, plataformas complejas de AFIP, gestión de firmas y sincronización Tango/Tango Nexus.',
                badge: 'Especialistas'
              },
              {
                icon: 'fa-cloud-arrow-up',
                title: 'Copias de Seguridad Silenciosas en la Nube',
                desc: 'Dejas tu sistema encendido y nosotros automatizamos el respaldo diario de tus bases de datos, correos y facturas directamente en la nube de forma segura.',
                badge: 'Cero Pérdida'
              }
            ].map((s, sidx) => (
              <ScrollReveal key={sidx} delay={sidx * 150} variant="up">
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full">
                  <div>
                    <span className="absolute top-8 right-8 text-[9px] bg-blue-55 px-2.5 py-1 rounded inline-block font-extrabold uppercase tracking-wide text-blue-650 bg-blue-50">
                      {s.badge}
                    </span>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6">
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800 leading-snug">{s.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Atención Personalizada</span>
                    <a 
                      href={getWhatsAppUrl(`Hola! Necesito consultar sobre la solución de ${s.title} para mi negocio.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      Solicitar Información <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified low-code automation section - highlighting benefit before tech */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white border border-slate-800 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="lg:w-7/12">
              <ScrollReveal variant="left">
                <span className="text-emerald-400 font-bold text-[11px] sm:text-xs uppercase tracking-widest mb-4 bg-emerald-500/10 px-3 py-1.5 rounded-full inline-block border border-emerald-500/20">
                  ⚡ ORGANIZA TU OFICINA Y AHORRA TIEMPO
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mt-2">
                  Deja que los sistemas trabajen por ti
                </h2>
                <h3 className="text-lg text-emerald-300 font-bold mt-2">Ahorra hasta un día entero de trabajo operativo por semana.</h3>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-6">
                  ¿Haces la misma tarea de copiar y pegar entre correos, Excel, WhatsApp y sistemas internos una y otra vez? Eso puede hacerse de forma automática e inteligente.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    { title: 'Presupuestos e Informes Automáticos', desc: 'Cuando un cliente completa un formulario en tu web, se le puede enviar una respuesta personalizada al instante con tus catálogos o propuestas.' },
                    { title: 'Organización de Archivos', desc: 'Los comprobantes de pago de tus correos o mensajes se descargan y se guardan solos en carpetas ordenadas en tu Google Drive.' },
                    { title: 'Notificaciones a tu Teléfono', desc: 'Entérate al instante en tu celular cuando un cliente importante complete un trámite o realice una compra, sin revisar manualmente.' }
                  ].map((benefit, bidx) => (
                    <div key={bidx} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-1">
                        <i className="fa-solid fa-chevron-right text-[10px]"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{benefit.title}</h4>
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-400">
                  <span className="bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono text-slate-300">Respaldo: n8n Low-Code Engine</span>
                  <p className="leading-normal">Conectamos tus programas mediante la herramienta líder de automatización sin desarrollar código desde cero.</p>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:w-5/12 w-full">
              <ScrollReveal variant="right" delay={200}>
                {/* Simulated interactive simple dashboard demonstrating automation workflow visually */}
                <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
                  <span className="text-[10px] font-mono text-emerald-400 block mb-4 border-b border-slate-800 pb-2">DIAGRAMA DEL TRABAJO AUTOMATIZADO</span>
                  
                  <div className="space-y-4 relative">
                    {/* Line visuals */}
                    <div className="absolute left-[20px] top-[40px] bottom-[30px] w-0.5 bg-dashed bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 opacity-30"></div>

                    <div className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0 border border-blue-500/30">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Paso 1: Entra una consulta</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Llega un formulario, correo corporativo o mensaje de consulta.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <i className="fa-solid fa-share-nodes"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Paso 2: Enrutamiento Inteligente</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">El sistema n8n procesa la información y la copia en un Excel de control.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <i className="fa-solid fa-paper-plane"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Paso 3: Envío Automático</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Se genera un borrador o un WhatsApp instantáneo de respuesta rápida.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <a 
                      href={getWhatsAppUrl("Hola! Me gustaría entender qué procesos rutinarios de mi oficina se pueden automatizar para ahorrar horas.")}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      <i className="fa-brands fa-whatsapp text-sm"></i>
                      Quiero Automatizar mi Oficina
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Benefits: Why Pick Us? */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">VENTAJAS CLAVE</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
              Razones por las que nos eligen para proteger su trabajo
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-3">
              No nos gusta complicar las cosas con tecnicismos innecesarios. Trabajamos bajo reglas claras y acuerdos que benefician directamente tu ritmo laboral.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: 'fa-user-nurse',
                title: 'Trato Humano y Directo',
                desc: 'Sin conmutadores robóticos, cuestionarios infinitos ni llamadas en espera. Te atiende directo un especialista de confianza.'
              },
              {
                icon: 'fa-shield-halved',
                title: 'Conexión 100% Segura',
                desc: 'Solo nos conectamos con AnyDesk tras tu consentimiento expreso en pantalla. Nadie puede acceder sin tu código temporal.'
              },
              {
                icon: 'fa-clock-rotate-left',
                title: 'SLA Crítico Garantizado',
                desc: 'Contamos con tiempos límite estrictos de soporte para que nunca pases más de dos horas parado ante una urgencia de trabajo.'
              },
              {
                icon: 'fa-calculator',
                title: 'Costo Fijo Sin Sorpresas',
                desc: 'Nuestros abonos mensuales te garantizan un costo fijo, programado de antemano de forma mensual. Evita cobros inesperados.'
              }
            ].map((benefit, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="up">
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg mb-4">
                    <i className={`fa-solid ${benefit.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{benefit.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Segments Served Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">PERFILES ATENDIDOS</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
              Sectores que mantienen su tecnología estable hoy
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-3">
              Ofrecemos tranquilidad digital a quienes necesitan que su computadora sea una herramienta de productividad diaria, no un problema.
            </p>
            <div className="w-12 h-1 bg-emerald-600 mx-auto mt-6 rounded-full"></div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-landmark-flag',
                title: 'Estudios Contables & Contadores',
                desc: 'Asistencia especializada rápida en servidores de bases de datos de Tango, instalación de aplicativos SIAP, configuración de navegadores viejos para plataformas de AFIP sin errores y resguardo en la nube diario.'
              },
              {
                icon: 'fa-shop',
                title: 'Comercios & Oficinas Administrativas',
                desc: 'Mapeo de conectividad Wi-Fi para invitados, configuración de impresoras de red y ticketeadoras de facturas, sistemas de cobro continuos y protección contra pérdida repentina de información comercial.'
              },
              {
                icon: 'fa-house-laptop',
                title: 'Trabajadores Independientes & Remotos',
                desc: 'Limpieza profunda de virus y programas basura que ralentizan el equipo, optimización integral de memoria y disco duro, soporte preventivo de Office/Outlook y resolución ágil de fallos del sistema.'
              }
            ].map((segment, sidx) => (
              <ScrollReveal key={sidx} delay={sidx * 150} variant="up">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center text-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <i className={`fa-solid ${segment.icon}`}></i>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-slate-900">{segment.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">{segment.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/50">
                    <a 
                      href={getWhatsAppUrl(`Excelente! Me interesaría soporte técnico como parte del sector: ${segment.title}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-extrabold text-xs inline-flex items-center gap-1 hover:underline"
                    >
                      Consultar Soluciones en tu Actividad <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* High Converting Conversion Closing CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="scale">
            <div className="bg-gradient-to-br from-blue-750 to-indigo-900 bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-center text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-headset text-9xl"></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 inline-block mb-4">
                SOPORTE INFORMÁTICO Y ASISTENCIA RÁPIDA
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight">
                ¿Listo para dejar atrás los constantes fallos y problemas imprevistos?
              </h2>
              <p className="text-slate-300 text-xs sm:text-base opacity-90 mb-10 max-w-2xl mx-auto">
                No arriesgues la facturación ni la tranquilidad de tu oficina un día más. Hablemos hoy por WhatsApp sin ningún compromiso y acordemos una agenda de asistencia que cubra tus requerimientos reales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href={getWhatsAppUrl("Hola! Me gustaría coordinar un llamado de asesoría técnica para evaluar y estabilizar los sistemas de mi oficina o consultorio.")}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-all shadow-md flex items-center justify-center gap-3 w-full sm:w-auto h-14"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  Escríbenos por WhatsApp Hoy
                </a>
                <Link 
                  to="/contacto" 
                  className="bg-transparent hover:bg-white/5 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-sm transition-all text-center w-full sm:w-auto h-14 flex items-center justify-center"
                >
                  Prefiero el Formulario Web
                </Link>
              </div>

              <p className="text-[10px] text-slate-500 italic mt-8">
                Al presionar contactas directamente con un soporte especializado para iniciar el diagnóstico técnico de tus computadoras.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
