import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

// Added React import to satisfy the React.FC namespace requirement
const Footer: React.FC = () => {
  const [contact, setContact] = useState(storageService.getContact());

  useEffect(() => {
    const handleUpdate = (event: any) => {
      if (event.detail.key === 'contact') {
        setContact(storageService.getContact());
      }
    };

    window.addEventListener('nexus_storage_update', handleUpdate);
    // Carga inicial por si acaso
    setContact(storageService.getContact());

    return () => window.removeEventListener('nexus_storage_update', handleUpdate);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">N</div>
              <span className="text-xl font-bold text-white">Nexus IT</span>
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
        
        <div className="pt-8 border-t border-slate-800 text-center text-xs opacity-50">
          <p>&copy; {new Date().getFullYear()} Nexus IT Soluciones. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;