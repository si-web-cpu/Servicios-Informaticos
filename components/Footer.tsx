
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

const Footer: React.FC = () => {
  const [contact, setContact] = useState(storageService.getContact());
  const [visitCount, setVisitCount] = useState<number>(0);
  const BASE_VISITS = 1248; // Base para proyectar trayectoria profesional

  useEffect(() => {
    // Función para obtener visitas globales
    const fetchGlobalVisits = async () => {
      try {
        // Utilizamos CounterAPI (un servicio gratuito y estable para contadores globales)
        // El namespace es único para tu proyecto
        const response = await fetch('https://api.counterapi.dev/v1/servicios-informaticos-nexus/visits/up');
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        // Sumamos el conteo real de la API a nuestra base establecida
        setVisitCount(BASE_VISITS + data.count);
      } catch (error) {
        console.warn('CounterAPI no disponible, usando fallback local.');
        // Fallback: Si la API falla, usamos el contador local para no dejar el espacio vacío
        const savedVisits = localStorage.getItem('si_visit_count');
        if (savedVisits) {
          setVisitCount(parseInt(savedVisits));
        } else {
          setVisitCount(BASE_VISITS);
        }
      }
    };

    fetchGlobalVisits();

    const handleUpdate = (event: any) => {
      if (event.detail.key === 'contact') {
        setContact(storageService.getContact());
      }
    };

    window.addEventListener('nexus_storage_update', handleUpdate);
    setContact(storageService.getContact());

    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
              <span className="text-xl font-bold text-white">Servicios Informáticos</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Damos vida a tus dispositivos y conectamos tu mundo. Tu partner tecnológico de confianza para el día a día.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navegación</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
              <li><Link to="/nosotros" className="hover:text-blue-400 transition-colors">Quiénes Somos</Link></li>
              <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Servicios</Link></li>
              <li><Link to="/noticias" className="hover:text-blue-400 transition-colors">Noticias</Link></li>
              <li><Link to="/aplicaciones" className="hover:text-blue-400 transition-colors">Aplicaciones</Link></li>
              <li><Link to="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Servicios Populares</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Soporte Técnico PC</Link></li>
              <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Seguridad Informática</Link></li>
              <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Diseño Web con IA</Link></li>
              <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Backups Automáticos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Síguenos</h4>
            <div className="flex gap-4 mb-6">
              {contact.facebook && (
                <a 
                  href={contact.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-white" 
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {contact.instagram && (
                <a 
                  href={contact.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 transition-all text-white" 
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              <a 
                href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors text-white" 
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
            <Link to="/admin" className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Acceso Staff</Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-xs opacity-50 flex flex-col items-center gap-2">
          <p>&copy; {new Date().getFullYear()} Servicios Informáticos. Todos los derechos reservados.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            {/* Contador de visitas Global y Discreto */}
            <div 
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-60 transition-opacity cursor-default" 
              title="Total de visitas globales registradas"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              <span>Visitas Globales: {visitCount > 0 ? visitCount.toLocaleString() : 'Cargando...'}</span>
            </div>

            {/* Versión de la Web */}
            <div className="text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-60 transition-opacity cursor-default">
              <span>Versión 1.5.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
