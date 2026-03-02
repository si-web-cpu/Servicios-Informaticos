
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { UsefulApp } from '../types';
import ScrollReveal from '../components/ScrollReveal';

const UsefulApps: React.FC = () => {
  const [apps, setApps] = useState<UsefulApp[]>(storageService.getApps());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail.key === 'apps') {
        setApps(storageService.getApps());
      }
    };
    window.addEventListener('nexus_storage_update', handleUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  const filteredApps = filter === 'all' 
    ? apps 
    : apps.filter(app => app.category === filter);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'fa-list' },
    { id: 'utilidad', name: 'Utilidad', icon: 'fa-screwdriver-wrench' },
    { id: 'multimedia', name: 'Multimedia', icon: 'fa-film' },
    { id: 'seguridad', name: 'Seguridad', icon: 'fa-shield-halved' },
    { id: 'otros', name: 'Otros', icon: 'fa-ellipsis' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Aplicaciones Útiles</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Una selección curada de herramientas gratuitas y freeware para optimizar el uso de tu PC y la gestión de archivos.
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                filter === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((app, index) => (
            <ScrollReveal key={app.id} delay={index * 100}>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group h-full flex flex-col">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className={`fa-solid ${app.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{app.name}</h3>
                <p className="text-slate-600 mb-6 flex-grow">{app.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {app.category}
                  </span>
                  <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                  >
                    Descargar <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-3xl mx-auto mb-4">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No se encontraron aplicaciones</h3>
            <p className="text-slate-500">Intenta con otra categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsefulApps;
