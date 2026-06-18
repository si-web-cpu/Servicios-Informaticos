import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [filter, setFilter] = useState<'todos' | 'remoto' | 'sistemas'>('todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [services, setServices] = useState<any[]>(() => storageService.getServices());
  const [planesMensuales, setPlanesMensuales] = useState<any[]>(() => storageService.getPlanes());

  useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'planes') {
        setPlanesMensuales(storageService.getPlanes());
      }
      if (event.detail.key === 'services') {
        setServices(storageService.getServices());
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
    <div className="pt-16 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-24">
        
        {/* Header de la sección */}
        <ScrollReveal className="text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">CATÁLOGO OPERATIVO ESPECÍFICO</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">Especialidades de Consultoría Técnica</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Elimina el desorden técnico de tu negocio. Brindamos soporte remoto altamente especializado con el fin de que tu negocio funcione libre de fricciones.
          </p>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </ScrollReveal>

        {/* Clasificación de Especialidades */}
        <div>
          <ScrollReveal variant="scale" className="flex justify-center gap-3 mb-12">
            {[
              { id: 'todos', label: 'Ver Todo' },
              { id: 'remoto', label: '💻 Soporte Remoto' },
              { id: 'sistemas', label: '⚙️ Sistemas & Infraestructura' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  filter === f.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </ScrollReveal>

          {/* Cards de especialidades */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <ScrollReveal key={service.id || idx} delay={(idx % 3) * 120} variant="up">
                <div className="group bg-white p-8 rounded-3xl border border-slate-200/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <i className={`fa-solid ${service.icon}`}></i>
                    </div>
                    <div className={`inline-block px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-md mb-4 ${
                      service.category === 'remoto' ? 'bg-blue-55 bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {service.category === 'remoto' ? 'Atención Remota' : 'Sistemas & Backups'}
                    </div>
                    <h3 className="text-lg font-bold mb-2.5 text-slate-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">{service.desc}</p>
                  </div>
                  {service.info && (
                    <div className="mt-6 pt-4 border-t border-slate-100 italic text-[11px] text-slate-400 font-medium">
                      ✓ {service.info}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Portafolio Casos de Éxito */}
        <div className="pt-16 border-t border-slate-200">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">CASOS DE ÉXITO REALES</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">Nuestras Soluciones en Acción</h2>
            <p className="text-slate-500 text-sm">Casos reales de pequeñas empresas y profesionales que eliminaron problemas técnicos y agilizaron su día a día.</p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioProjects.map((project, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="up">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-slate-200/60">
                  <div className="h-48 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{project.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm mb-6 flex-grow">{project.description}</p>
                    <button onClick={() => openModal(project)} className="text-blue-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all text-left">Ver Detalle <i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">{selectedProject.title}</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border">
                  <h4 className="font-extrabold text-blue-600 uppercase text-[10px] tracking-widest mb-1">Desafío</h4>
                  <p className="text-slate-700 text-xs sm:text-sm">{selectedProject.challenge}</p>
                </div>
                <div className="p-1">
                  <h4 className="font-extrabold text-blue-600 uppercase text-[10px] tracking-widest mb-1">Solución Técnica Aplicada</h4>
                  <p className="text-slate-705 text-xs sm:text-sm text-slate-700">{selectedProject.solution}</p>
                </div>
                <div className="bg-green-50 p-5 rounded-2xl border border-green-200">
                  <h4 className="font-extrabold text-emerald-800 uppercase text-[10px] tracking-widest mb-1">Impacto Logrado</h4>
                  <p className="text-emerald-900 font-bold text-xs sm:text-sm">{selectedProject.result}</p>
                </div>
              </div>
              <button onClick={closeModal} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg text-sm transition-colors cursor-pointer">Cerrar Detalle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
