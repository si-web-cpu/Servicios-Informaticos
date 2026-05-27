import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

interface WorkflowTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  nodes: { title: string; desc: string; type: 'trigger' | 'action' | 'ai' | 'destination' }[];
}

const Automation: React.FC = () => {
  // Calculadora de ROI
  const [hoursSpent, setHoursSpent] = useState<number>(8); // Horas semanales
  const [hourlyRate, setHourlyRate] = useState<number>(20); // Valor de la hora
  const [errorCost, setErrorCost] = useState<number>(50); // Costo de errores o retrasos mensuales

  // Cálculos ROI
  const weeklySavings = hoursSpent * hourlyRate;
  const monthlySavingsTime = weeklySavings * 4.33; // promedio de semanas en un mes
  const totalMonthlySavings = monthlySavingsTime + errorCost;
  const totalYearlySavings = totalMonthlySavings * 12;
  const hoursSavedYearly = hoursSpent * 4.33 * 12;

  // Plantilla seleccionada para el mapa visual interactivo
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('form-alarm');

  const workflows: WorkflowTemplate[] = [
    {
      id: 'form-alarm',
      name: 'Contacto Web ➜ Google Sheets + Telegram',
      icon: 'fa-network-wired',
      description: 'Envía los mensajes de tus clientes directamente a una hoja de cálculo unificada de Google Sheets en tiempo real y te notifica de inmediato al móvil vía Telegram.',
      nodes: [
        { title: 'Webhook Entrada', desc: 'Recibe datos de tu Formulario Web', type: 'trigger' },
        { title: 'Google Sheets', desc: 'Guarda Nombre, Email, Asunto y Mensaje', type: 'destination' },
        { title: 'Generador Formato', desc: 'Prepara el texto del mensaje para Telegram', type: 'action' },
        { title: 'Telegram Send', desc: 'Envía notificación instantánea a tu celular', type: 'destination' }
      ]
    },
    {
      id: 'ai-responder',
      name: 'Respuesta Inmediata Inteligente con IA',
      icon: 'fa-brain',
      description: 'Evalúa la consulta del prospecto usando inteligencia artificial de ChatGPT o Gemini, redacta una respuesta coherente en base a tu catálogo y te propone un borrador listo para enviar.',
      nodes: [
        { title: 'Webhook Entrada', desc: 'Entrada de un nuevo contacto web', type: 'trigger' },
        { title: 'Filtro & Análisis', desc: 'Valida validez del correo e idioma', type: 'action' },
        { title: 'Agente Gemini / GPT', desc: 'Evalúa consulta y redacta plantilla de respuesta', type: 'ai' },
        { title: 'E-mail Borrador', desc: 'Guarda borrador en tu Gmail / Outlook', type: 'destination' }
      ]
    },
    {
      id: 'lead-sync',
      name: 'Recordatorios Automatizados y Sync de Agenda',
      icon: 'fa-calendar-check',
      description: 'Cuando un cliente solicita una asesoría técnica, se crea automáticamente una cita en Google Calendar y se le envía un correo con el link de la reunión virtual de forma transparente.',
      nodes: [
        { title: 'Solicitud Cita', desc: 'El cliente agenda su turno en la web', type: 'trigger' },
        { title: 'Google Calendar', desc: 'Crea evento y bloquea horarios en tu agenda', type: 'destination' },
        { title: 'Google Meet / Zoom', desc: 'Genera el enlace de videoconferencia único', type: 'action' },
        { title: 'E-mail Confirmación', desc: 'Despacha recordatorio con indicaciones al correo', type: 'destination' }
      ]
    }
  ];

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflow) || workflows[0];

  return (
    <div className="pt-16 pb-20 bg-slate-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <i className="fa-solid fa-bolt animate-pulse"></i> Súbete a la Automatización (no-code / low-code)
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Haz que la Tecnología <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Trabaje para Ti</span> con n8n
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-slate-300 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
              ¿Pasas horas copiando datos, enviando recordatorios o unificando planillas? 
              Diseñamos e implementamos flujos con <strong>n8n</strong> para conectar tu Sitio Web, Google Sheets, 
              Telegram, CRM y la Inteligencia Artificial en una sola maquinaria coordinada.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300} className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Calcular Tiempo Ahorrado
            </button>
            <Link to="/contacto" className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl font-bold transition-all hover:-translate-y-0.5">
              Consultar Proyecto Personalizado
            </Link>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* Intro n8n */}
        <ScrollReveal variant="up">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-diagram-project"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                ¿Qué es n8n y por qué es una revolución?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                n8n es un motor de flujos lógicos open-source y auto-alojable sumamente poderoso. A diferencia de Zapier, 
                no te cobra costosas mensualidades por cada tarea procesada. Permite crear ramas con lógicas complejas, 
                filtrados de datos en crudo y la integración de modelos de procesado de lenguaje (Inteligencia Artificial).
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                  <span><strong>Conectividad infinita:</strong> Gmail, Google Sheets, Telegram, WhatsApp, OpenAI, Notion y más.</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                  <span><strong>Soberanía de datos:</strong> Todo puede correr de manera local o en servidores propios.</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                  <span><strong>Automatización sin límites:</strong> Sin cobros por cantidad de ejecuciones.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-center text-left relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">N8N_ENGINE: LIVE</span>
              </div>
              <p className="text-emerald-400 font-mono text-xs mb-3">&gt; Inicializando Nodo Automatizado...</p>
              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                  <p className="text-[10px] text-slate-500 mb-1">// Trigger de Entrada</p>
                  <p className="text-white font-bold"><i className="fa-solid fa-globe text-blue-400 mr-2"></i> Formulario de Contacto Web recibido</p>
                  <p className="text-slate-400 text-[10px] mt-1">IP: 181.44.*.* | Nombre: Juan Pérez</p>
                </div>
                <div className="flex justify-center my-1">
                  <i className="fa-solid fa-down-long text-slate-600 animate-bounce"></i>
                </div>
                <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                  <p className="text-[10px] text-slate-500 mb-1">// Acción interconectada</p>
                  <p className="text-white font-bold"><i className="fa-solid fa-table text-green-400 mr-2"></i> Google Sheets - Registrar Fila</p>
                  <p className="text-slate-400 text-[10px] mt-1">Fila Añadida: Col A: Juan, Col B: juan@mail.com</p>
                </div>
                <div className="flex justify-center my-1">
                  <i className="fa-solid fa-down-long text-slate-600"></i>
                </div>
                <div className="bg-slate-900 p-3.5 rounded border border-slate-800">
                  <p className="text-[10px] text-slate-500 mb-1">// Canal Mensajería</p>
                  <p className="text-white font-bold"><i className="fa-brands fa-telegram text-sky-400 mr-2"></i> Telegram Bot - Notificación</p>
                  <p className="text-emerald-400 text-[11px] mt-1">✓ Mensaje entregado con éxito al móvil</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Simulador Interactivo de Workflows */}
        <ScrollReveal variant="up">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Interactive Sandbox</span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1 mb-3">Modelos de Flujo Disponibles</h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">Selecciona una plantilla para visualizar de manera gráfica cómo se integra el flujo de información.</p>
            </div>

            {/* Selectores de flujo */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {workflows.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf.id)}
                  className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-full ${
                    selectedWorkflow === wf.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      selectedWorkflow === wf.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <i className={`fa-solid ${wf.icon}`}></i>
                    </div>
                    <span className="font-bold text-sm tracking-tight leading-snug">{wf.name}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${selectedWorkflow === wf.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {wf.description.slice(0, 110)}...
                  </p>
                </button>
              ))}
            </div>

            {/* Visualizador de Nodos */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-500 mb-6 flex justify-between items-center border-b border-slate-800 pb-3">
                <span>VISTA DE DIAGRAMA DE NODOS (N8N)</span>
                <span className="uppercase text-blue-400 font-bold">{activeWorkflow.name}</span>
              </div>

              {/* Conectores y nodos */}
              <div className="grid md:grid-cols-4 gap-6 relative">
                {activeWorkflow.nodes.map((node, nidx) => (
                  <div key={nidx} className="relative flex flex-col items-center">
                    {/* Tarjeta del Nodo */}
                    <div className={`w-full p-4 rounded-xl border flex flex-col items-center text-center relative z-10 transition-transform hover:scale-105 duration-300 ${
                      node.type === 'trigger' ? 'bg-amber-950/40 border-amber-600/50 text-amber-200' :
                      node.type === 'ai' ? 'bg-purple-950/40 border-purple-600/50 text-purple-200' :
                      node.type === 'destination' ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200' :
                      'bg-slate-800/80 border-slate-700 text-slate-100'
                    }`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-3 bg-slate-900 border border-white/10">
                        {node.type === 'trigger' && <i className="fa-solid fa-play text-amber-400"></i>}
                        {node.type === 'ai' && <i className="fa-solid fa-brain text-purple-400"></i>}
                        {node.type === 'destination' && <i className="fa-solid fa-database text-emerald-400"></i>}
                        {node.type === 'action' && <i className="fa-solid fa-gears text-blue-400"></i>}
                      </div>
                      
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{node.type}</div>
                      <div className="font-bold text-sm mb-1">{node.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{node.desc}</div>
                    </div>

                    {/* Flecha de conexión (no para el último nodo) */}
                    {nidx < activeWorkflow.nodes.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-0">
                        <i className="fa-solid fa-chevron-right text-slate-700 text-lg"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Calculadora de ROI */}
        <div id="roi-calculator">
          <ScrollReveal variant="up">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                    Calculadora de Retorno de Inversión
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-white mb-2">¿Cuánto te cuesta hacer tareas manuales?</h3>
                  <p className="text-slate-400 text-sm">Calcula el inmenso impacto económico y de tiempo que pierdes en operaciones administrativas repetitivas.</p>
                </div>

                <div className="space-y-6">
                  {/* Slider 1: Horas Semanales */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-sm font-semibold text-slate-300">Tiempo semanal en tareas repetitivas:</span>
                      <span className="text-blue-400 text-sm font-bold">{hoursSpent} Horas / semana</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="40" 
                      value={hoursSpent} 
                      onChange={(e) => setHoursSpent(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>1 Hora (Pequeño Control)</span>
                      <span>40 Horas (1 Empleado completo)</span>
                    </div>
                  </div>

                  {/* Slider 2: Rate por Hora */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-sm font-semibold text-slate-300">Costo / valor aproximado de tu hora laboral:</span>
                      <span className="text-emerald-400 text-sm font-bold">${hourlyRate} USD / hora</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>$5 USD</span>
                      <span>$100 USD (Valor comercial experto)</span>
                    </div>
                  </div>

                  {/* Slider 3: Costes de Errores */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-sm font-semibold text-slate-300">Costo mensual estimado por errores manuales o prospectos perdidos:</span>
                      <span className="text-amber-400 text-sm font-bold">${errorCost} USD / mes</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={errorCost} 
                      step="10"
                      onChange={(e) => setErrorCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>$0 USD (Impecable)</span>
                      <span>$500 USD (Pérdidas de leads / errores de tipeo)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados */}
              <div className="lg:col-span-5 bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center flex flex-col justify-between h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                  ✓ RETORNO GARANTIZADO
                </div>

                <div className="space-y-6 my-4">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest text-[10px]">Ahorro Estimado Anual</span>
                    <h4 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight mt-1">
                      ${Math.round(totalYearlySavings).toLocaleString()} USD
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
                    <div className="text-left bg-slate-900/60 p-4 rounded-xl">
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">Ahorro Mensual</p>
                      <p className="text-lg font-bold text-white mt-1">${Math.round(totalMonthlySavings).toLocaleString()} USD</p>
                    </div>
                    <div className="text-left bg-slate-900/60 p-4 rounded-xl flex flex-col justify-between">
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">Tiempo Recuperado</p>
                      <p className="text-lg font-bold text-blue-400 mt-1">{Math.round(hoursSavedYearly)} Hs / año</p>
                    </div>
                  </div>

                  <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-300 leading-relaxed text-left flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-quote text-blue-400 text-lg mt-0.5"></i>
                    <p>
                      Al optimizar el flujo con n8n, liberas más de un día laboral completo al mes. Esto te permite enfocarte en 
                      <strong> ventas activas y crecimiento real</strong> en lugar de tareas repetitivas de oficina.
                    </p>
                  </div>
                </div>

                <Link to="/contacto" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold mt-4 block text-sm transition-all shadow-lg shadow-emerald-900/20">
                  Implementar Esta Solución
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
        </div>

        {/* Pros & Contras (Y Cómo los Solucionamos) */}
        <ScrollReveal variant="up">
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Comparativa Analítica</span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-1 mb-2">Ventajas vs Desafíos de n8n</h2>
              <p className="text-slate-500 text-sm">Somos transparentes. Automatizar tiene inmensos beneficios, pero también presenta retos. Te contamos cuáles son y cómo los solventamos.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ventajas */}
              <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-lg">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">Grandes Beneficios</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <i className="fa-solid fa-check text-emerald-600 font-bold mt-1 text-sm bg-emerald-100 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">Cero Costos de Suscripción por Ejecución</h4>
                      <p className="text-emerald-900/80 text-xs leading-relaxed mt-0.5">A diferencia de Zapier o Make, puedes correrlo de forma gratuita o autohostearlo sin límites de tareas ni pagos por gatillo.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <i className="fa-solid fa-check text-emerald-600 font-bold mt-1 text-sm bg-emerald-100 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">Ejecución en Tiempo Real</h4>
                      <p className="text-emerald-900/80 text-xs leading-relaxed mt-0.5">El flujo reacciona al instante. No hay tiempos de espera adicionales para recibir notificaciones críticias.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <i className="fa-solid fa-check text-emerald-600 font-bold mt-1 text-sm bg-emerald-100 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">Consolidación Sin Intervención Humana</h4>
                      <p className="text-emerald-900/80 text-xs leading-relaxed mt-0.5">Los datos se almacenan y formatean bajo el mismo estándar, eliminando los errores de tipeo y duplicidades manuales.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desafíos y SOLUCIÓN EXPLICADA */}
              <div className="bg-slate-100/60 p-8 rounded-3xl border border-slate-200/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-700 text-white rounded-xl flex items-center justify-center text-lg">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Desafíos & Solución Técnica</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <i className="fa-solid fa-circle-info text-slate-600 font-bold mt-1 text-sm bg-slate-200 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-slate-850 text-sm">Reto: Curva de configuración y código</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Configurar webhooks y conexiones de API puede ser complejo.</p>
                      <p className="text-blue-600 text-xs font-bold mt-1">💡 Solución: Nosotros nos encargamos de diseñar, testear e implementar todo a medida.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <i className="fa-solid fa-circle-info text-slate-600 font-bold mt-1 text-sm bg-slate-200 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-slate-850 text-sm">Reto: Cambios e inestabilidad de las APIs</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Si Google o Telegram modifican sus sistemas de acceso, un flujo puede romperse.</p>
                      <p className="text-blue-600 text-xs font-bold mt-1">💡 Solución: Entregamos documentación y damos mantenimiento proactivo periódico ante caídas.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <i className="fa-solid fa-circle-info text-slate-600 font-bold mt-1 text-sm bg-slate-200 p-1.5 rounded-full h-8 w-8 flex items-center justify-center"></i>
                    <div>
                      <h4 className="font-bold text-slate-850 text-sm">Reto: n8n local y puertos cerrados</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Una instancia n8n local detrás de un módem doméstico no puede recibir webhooks públicos externos por defecto.</p>
                      <p className="text-blue-600 text-xs font-bold mt-1">💡 Solución: Configuramos túneles seguros o servidores VPS económicos. ¡Ver detalle abajo!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Didáctica: n8n Local y Webhooks */}
        <ScrollReveal variant="up">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 mx-auto">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">El dilema técnico: ¿n8n en Local o en la Nube?</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Si corres tus flujos de n8n de manera local en tu propia oficina (en un servidor o PC personal), notarás que la web 
                  no puede enviarte y gatillar webhooks directamente porque tu módem local está protegido con un cortafuegos (puertos cerrados).
                </p>
              </div>

              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                <h4 className="font-bold text-slate-800 text-base border-b pb-2"><i className="fa-solid fa-network-wired text-blue-500 mr-2"></i>Tenemos 3 formas inteligentes de resolver este escenario:</h4>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">OPCIÓN 1</span>
                      <h5 className="font-bold text-slate-800 text-sm mt-2 mb-1">Túnel Seguro <br />(Ngrok / Cloudflare)</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Crea un puente cifrado y gratuito desde internet hacia tu puerto n8n local (`http://localhost:5678`), dándote una URL pública segura (`https://tu-flujo.trycloudflare.com`) lista para recibir datos de inmediato.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 mt-3 font-semibold">✓ Costo: $0 USD | Ideal para Testing</div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">OPCIÓN 2</span>
                      <h5 className="font-bold text-slate-800 text-sm mt-2 mb-1">Servidor Cloud VPS <br />(DigitalOcean / AWS)</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Instalamos n8n de forma privada en un micro-servidor en la nube que está encendido 24/7 sin involucrar el procesador de tu PC. Tus webhooks siempre estarán online y listos.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 mt-3 font-semibold">✓ Costo: ~$5 USD/mes | Alta Disponibilidad</div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">OPCIÓN 3</span>
                      <h5 className="font-bold text-slate-800 text-sm mt-2 mb-1">Polling Pasivo <br />(Lectura Recurrente)</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Si no deseas exponer puertos ni pagar servidores, configuramos el n8n local para que consulte (haga pooling) activamente tu hoja de Google Sheets cada 10 minutos. No requiere webhooks abiertos.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 mt-3 font-semibold">✓ Costo: $0 USD | Seguro & Sencillo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal variant="up">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8 text-center">Preguntas Frecuentes sobre Automatización</h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <i className="fa-solid fa-circle-question text-blue-500 mt-0.5"></i>
                  <span>¿Necesito saber programar para usar los flujos creados?</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed pl-6">
                  Absolutamente no. Nosotros hacemos toda la puesta a punto y te entregamos el sistema completamente automatizado 
                  con interfaces intuitivas. Te capacitamos con un video explicativo paso a paso.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <i className="fa-solid fa-circle-question text-blue-500 mt-0.5"></i>
                  <span>¿Qué pasa si cambian mis requerimientos en el futuro?</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed pl-6">
                  n8n es altamente modular. Podemos añadir nuevos nodos, cambiar los canales (ej. migrar de Telegram a WhatsApp) 
                  o expandir la lógica fácilmente sin tener que reconstruir todo desde cero.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <i className="fa-solid fa-circle-question text-blue-500 mt-0.5"></i>
                  <span>¿Es seguro conectar mis cuentas de Google o CRM?</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed pl-6">
                  Sí. n8n utiliza los estándares de seguridad modernos de las APIs originales, como la autenticación OAuth2. 
                  Tus contraseñas nunca quedan visibles en crudo y tú eres el único que tiene control sobre las credenciales de tus apps.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <i className="fa-solid fa-circle-question text-blue-500 mt-0.5"></i>
                  <span>¿Puedo incorporar Inteligencia Artificial en los procesos?</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed pl-6">
                  Sí, n8n es uno de los mejores motores de automatización para IA. Podemos conectar modelos de lenguaje 
                  de OpenAI, Anthropic o Gemini para categorizar tus correos, calificar prospectos o proponer respuestas de forma autónoma.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ready to start CTA */}
        <ScrollReveal variant="scale">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-blue-900/10">
            <h3 className="text-3xl font-black mb-4">¿Listo para hacer que tu negocio sea inteligente?</h3>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Permítenos diseñar e integrar tu primer automatización gratuita para conectar tu web, tus planillas Google Sheets y Telegram. ¡Garantiza respuestas instantáneas en segundos!
            </p>
            <Link to="/contacto" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-2xl shadow-lg hover:bg-blue-50 transition-all hover:-translate-y-0.5">
              <i className="fa-solid fa-paper-plane"></i> Charlar con un Experto
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default Automation;
