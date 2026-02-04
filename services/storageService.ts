
import { newsData as defaultNews } from '../pages/News';

const defaultServices = [
  // Servicios Hogar
  { id: 'h1', title: 'Soporte Técnico de PC', category: 'hogar', icon: 'fa-laptop-medical', desc: 'Mantenimiento preventivo, limpieza física y optimización de software para tu computadora personal.', info: 'Servicio a domicilio o remoto.' },
  { id: 'h2', title: 'Redes Wi-Fi', category: 'hogar', icon: 'fa-wifi', desc: 'Instalación y configuración de routers, repetidores y extensores para cobertura total en tu casa.', info: 'Eliminamos zonas muertas.' },
  
  // Servicios Negocios
  { id: 'n1', title: 'Soporte Técnico de PC', category: 'negocios', icon: 'fa-microchip', desc: 'Mantenimiento de estaciones de trabajo para asegurar la continuidad de tu negocio.', info: 'Planes mensuales disponibles.' },
  { id: 'n2', title: 'Redes Wi-Fi', category: 'negocios', icon: 'fa-network-wired', desc: 'Diseño e implementación de redes robustas y seguras para oficinas y locales comerciales.', info: 'Segmentación de redes para invitados.' },
  { id: 'n3', title: 'Diseño Web IA', category: 'negocios', icon: 'fa-wand-magic-sparkles', desc: 'Creación de sitios web modernos optimizados con herramientas de inteligencia artificial.', info: 'Presencia online profesional.' },
  { id: 'n4', title: 'Asesoramiento IT Emprendedores', category: 'negocios', icon: 'fa-lightbulb', desc: 'Consultoría estratégica para elegir las mejores herramientas digitales para tu nuevo proyecto.', info: 'Optimiza tu inversión.' },
  { id: 'n5', title: 'Backups de Datos', category: 'negocios', icon: 'fa-database', desc: 'Sistemas de respaldo automático para proteger la información vital de tu emprendimiento.', info: 'Seguridad ante todo.' }
];

const defaultContact = {
  phone: '+54 351 381 0411',
  email: 'soporte@nexus-it.com',
  whatsapp: '+543513810411',
  facebook: 'https://facebook.com/nexusit',
  instagram: 'https://instagram.com/nexusit',
  hours: {
    week: '09:00 - 18:00',
    sat: '10:00 - 14:00',
    sun: 'Cerrado'
  }
};

const defaultSettings = {
  formEndpoint: '', // URL de Formspree o similar
  isMaintenanceMode: false
};

const notifyChange = (key: string) => {
  window.dispatchEvent(new CustomEvent('nexus_storage_update', { detail: { key } }));
};

export const storageService = {
  getNews: () => {
    const saved = localStorage.getItem('nexus_news');
    return saved ? JSON.parse(saved) : defaultNews;
  },
  saveNews: (data: any[]) => {
    localStorage.setItem('nexus_news', JSON.stringify(data));
    notifyChange('news');
  },
  getServices: () => {
    const saved = localStorage.getItem('nexus_services');
    return saved ? JSON.parse(saved) : defaultServices;
  },
  saveServices: (data: any[]) => {
    localStorage.setItem('nexus_services', JSON.stringify(data));
    notifyChange('services');
  },
  getContact: () => {
    const saved = localStorage.getItem('nexus_contact');
    return saved ? JSON.parse(saved) : defaultContact;
  },
  saveContact: (data: any) => {
    localStorage.setItem('nexus_contact', JSON.stringify(data));
    notifyChange('contact');
  },
  getSettings: () => {
    const saved = localStorage.getItem('nexus_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  },
  saveSettings: (data: any) => {
    localStorage.setItem('nexus_settings', JSON.stringify(data));
    notifyChange('settings');
  }
};
