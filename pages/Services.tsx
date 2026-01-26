
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

interface Project {
  title: string;
  image: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  result: string;
}

const Services: React.FC = () => {
  const [filter, setFilter] = useState<'todos' | 'hogar' | 'negocios'>('todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    setServices(storageService.getServices());
  }, []);

  const portfolioProjects: Project[] = [
    {
      title: 'E-commerce Moda Sostenible',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'Stripe', 'Node.js'],
      description: 'Tienda online completa con pasarela de pagos y gestión de stock en tiempo real.',
      challenge: 'La tienda perdía ventas por un proceso de checkout lento y falta de stock actualizado.',
      solution: 'Implementamos una SPA (Single Page Application) con sincronización en tiempo real y pasarela segura.',
      result: 'Incremento del 45% en la tasa de conversión durante los primeros 3 meses.'
    },
    {
      title: 'Portal Médico con Chatbot AI',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      tags: ['Soporte SI AI', 'Tailwind', 'Next.js'],
      description: 'Sistema de reserva de turnos con asistente virtual que triaje los síntomas básicos.',
      challenge: 'Saturación en las líneas telefónicas por consultas básicas sobre horarios y síntomas.',
      solution: 'Desarrollamos un asistente con Gemini AI capaz de agendar turnos y responder dudas frecuentes.',
      result: 'Reducción del 60% en llamadas administrativas no críticas.'
    }
  ];

  const filteredServices = filter === 'todos' 
    ? services 
    : services.filter(s => s.category === filter);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ScrollReveal className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Servicios Profesionales</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Ofrecemos un abanico completo de soluciones para que la tecnología sea tu aliada y no un problema.</p>
        </ScrollReveal>

        <ScrollReveal variant="scale" delay={100} className="flex justify-center gap-4 mb-12">
          {['todos', 'hogar', 'negocios'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredServices.map((service, idx) => (
            <ScrollReveal key={service.id || idx} delay={(idx % 3) * 150} variant="up">
              <div className="group bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2 h-full flex flex-col">
                <div className="w-16 h-16 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 w-fit">
                  {service.category === 'negocios' ? 'Negocios' : 'Hogar'}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{service.desc}</p>
                {service.info && (
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <p className="text-sm text-slate-500 italic leading-snug">{service.info}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Portafolio */}
        <div className="pt-20 border-t border-slate-200">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Casos de Éxito</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioProjects.map((project, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="up">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full border">
                  <div className="h-48 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h4>
                    <p className="text-slate-600 text-sm mb-6 flex-grow">{project.description}</p>
                    <button onClick={() => openModal(project)} className="text-blue-600 font-bold text-sm flex items-center gap-2">Ver Detalle <i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6">{selectedProject.title}</h2>
              <div className="space-y-6">
                <div><h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Desafío</h4><p>{selectedProject.challenge}</p></div>
                <div><h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Solución</h4><p>{selectedProject.solution}</p></div>
                <div className="bg-slate-50 p-4 rounded-xl font-medium border-l-4 border-green-500">Resultados: {selectedProject.result}</div>
              </div>
              <button onClick={closeModal} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
