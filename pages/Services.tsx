
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
    const updateData = () => {
      setServices(storageService.getServices());
    };

    updateData();

    const handleUpdate = (event: any) => {
      if (event.detail.key === 'services' || event.detail.key === 'portfolio') {
        updateData();
      }
    };

    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  const portfolioProjects: Project[] = storageService.getPortfolio();

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
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Ofrecemos soluciones tecnológicas para que la tecnología trabaje para ti.</p>
        </ScrollReveal>

        <ScrollReveal variant="scale" delay={100} className="flex justify-center gap-4 mb-12">
          {['todos', 'hogar', 'negocios'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'todos' ? 'Ver Todos' : f === 'hogar' ? '🏠 Hogar' : '🏢 Negocios'}
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
                <div className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 w-fit ${
                  service.category === 'negocios' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {service.category === 'negocios' ? 'Para Negocios' : 'Para el Hogar'}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm">{service.desc}</p>
                {service.info && (
                  <div className="mt-auto pt-4 border-t border-slate-50 italic text-xs text-slate-400">
                    {service.info}
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
                    <button onClick={() => openModal(project)} className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">Ver Detalle <i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6">{selectedProject.title}</h2>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Desafío</h4>
                  <p className="text-slate-700">{selectedProject.challenge}</p>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Solución Técnica</h4>
                  <p className="text-slate-700">{selectedProject.solution}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-l-4 border-green-500">
                  <h4 className="font-bold text-green-700 uppercase text-xs tracking-widest mb-1">Impacto Logrado</h4>
                  <p className="text-green-800 font-medium">{selectedProject.result}</p>
                </div>
              </div>
              <button onClick={closeModal} className="mt-8 w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-200">Cerrar Detalle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
