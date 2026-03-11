import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  getDocs,
  query,
  limit
} from "firebase/firestore";
import { db } from "./firebase";

const defaultNews = [
  {
    id: '1',
    title: 'Cómo proteger tu red Wi-Fi doméstica de intrusos',
    date: '15 Oct, 2024',
    excerpt: 'Cinco pasos fundamentales para configurar tu router y evitar que extraños accedan a tu conexión.',
    fullContent: `Proteger tu red inalámbrica es el primer paso para asegurar tu vida digital.`,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    author: 'Admin SI'
  },
  {
    id: '2',
    title: 'Windows 11: ¿Vale la pena actualizar ahora?',
    date: '02 Oct, 2024',
    excerpt: 'Analizamos las ventajas y desventajas del nuevo sistema operativo para pequeños emprendimientos.',
    fullContent: `Windows 11 ha madurado significativamente desde su lanzamiento.`,
    image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&w=800&q=80',
    author: 'Equipo SI'
  },
  {
    id: '3',
    title: 'La importancia del Backup en la nube para tu negocio',
    date: '20 Sep, 2024',
    excerpt: 'Por qué no deberías confiar solo en un disco duro externo para guardar tu información vital.',
    fullContent: `El error más común de los pequeños negocios es pensar que un disco externo "es suficiente".`,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    author: 'Consultoría SI'
  },
  {
    id: '4',
    title: '5 Señales de que tu PC necesita una limpieza interna',
    date: '10 Nov, 2024',
    excerpt: 'El polvo y la falta de mantenimiento térmico pueden matar tus componentes.',
    fullContent: `Muchos usuarios ignoran el mantenimiento físico de sus computadoras.`,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte Técnico SI'
  },
  {
    id: '5',
    title: 'IA en pequeños negocios: Cómo ChatGPT ayuda a vender',
    date: '28 Nov, 2024',
    excerpt: 'Descubre cómo automatizar tu atención al cliente con inteligencia artificial.',
    fullContent: `La democratización de la IA permite que un almacén compita con grandes firmas.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    author: 'Innovación SI'
  },
  {
    id: '6',
    title: 'Ciberseguridad 2025: Por qué el 2FA ya no es opcional',
    date: '05 Dic, 2024',
    excerpt: 'La autenticación en dos pasos es la barrera más efectiva contra el robo de cuentas.',
    fullContent: `Las contraseñas ya no son suficientes. Los ataques de phishing son cada vez más sofisticados.`,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    author: 'Ciberseguridad SI'
  },
  {
    id: '7',
    title: 'Optimización de Windows: Desactiva servicios innecesarios',
    date: '12 Ene, 2025',
    excerpt: 'Mejora el rendimiento de tu PC desactivando procesos que consumen RAM sin sentido.',
    fullContent: 'Windows viene con muchos servicios activados por defecto que la mayoría de los usuarios no necesitan.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte SI'
  },
  {
    id: '8',
    title: 'Cómo elegir la mejor laptop para tu emprendimiento',
    date: '20 Ene, 2025',
    excerpt: 'Guía completa sobre procesadores, RAM y almacenamiento para no malgastar tu dinero.',
    fullContent: 'A la hora de comprar una herramienta de trabajo, lo barato puede salir caro.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    author: 'Consultoría SI'
  },
  {
    id: '9',
    title: 'Linux para principiantes: ¿Es hora de cambiar?',
    date: '02 Feb, 2025',
    excerpt: 'Analizamos las ventajas y desventajas del nuevo sistema operativo para pequeños emprendimientos.',
    fullContent: 'Linux ya no es solo para expertos en terminal. Las interfaces modernas son muy amigables.',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    author: 'Equipo SI'
  },
  {
    id: '10',
    title: 'Mantenimiento de Impresoras: Evita que la tinta se seque',
    date: '15 Feb, 2025',
    excerpt: 'Trucos sencillos para prolongar la vida útil de tus cartuchos y cabezales.',
    fullContent: 'Las impresoras de inyección de tinta requieren un uso mínimo semanal para no obstruirse.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte SI'
  },
  {
    id: '11',
    title: 'Phishing por WhatsApp: La nueva amenaza en 2025',
    date: '25 Feb, 2025',
    excerpt: 'Cómo identificar mensajes falsos que intentan robar tu cuenta de WhatsApp.',
    fullContent: 'Los estafadores están usando técnicas de ingeniería social cada vez más convincentes.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=800&q=80',
    author: 'Ciberseguridad SI'
  },
  {
    id: '12',
    title: 'El futuro del soporte técnico remoto con Realidad Aumentada',
    date: '01 Mar, 2025',
    excerpt: 'Cómo estamos implementando nuevas tecnologías para guiarte en reparaciones físicas.',
    fullContent: 'La tecnología nos permite estar "ahí" contigo sin necesidad de desplazarnos físicamente.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80',
    author: 'Innovación SI'
  },
  {
    id: '13',
    title: 'Wi-Fi 7: La revolución inalámbrica ya está aquí',
    date: '05 Mar, 2025',
    excerpt: 'Velocidades de hasta 46 Gbps y latencia ultra baja para el hogar y la oficina.',
    fullContent: 'El nuevo estándar Wi-Fi 7 promete cambiar radicalmente nuestra experiencia de conexión.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    author: 'Redes SI'
  },
  {
    id: '14',
    title: 'Cómo limpiar tu PC sin dañarla: Guía definitiva',
    date: '10 Mar, 2025',
    excerpt: 'Productos recomendados y técnicas para mantener tu hardware impecable.',
    fullContent: 'El mantenimiento físico es tan importante como el mantenimiento de software.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte SI'
  },
  {
    id: '15',
    title: 'El auge de los Mini PCs en entornos corporativos',
    date: '15 Mar, 2025',
    excerpt: 'Potencia de escritorio en el tamaño de un libro. ¿Es la opción para tu oficina?',
    fullContent: 'Los Mini PCs están reemplazando a las torres tradicionales por su eficiencia y ahorro de espacio.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    author: 'Hardware SI'
  },
  {
    id: '16',
    title: 'IA Generativa: Herramientas gratuitas para potenciar tu negocio',
    date: '20 Mar, 2025',
    excerpt: 'Desde creación de imágenes hasta redacción de correos profesionales.',
    fullContent: 'No necesitas un gran presupuesto para aprovechar la inteligencia artificial en tu día a día.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    author: 'Innovación SI'
  },
  {
    id: '17',
    title: 'Seguridad en el Teletrabajo: VPN vs Escritorio Remoto',
    date: '25 Mar, 2025',
    excerpt: 'Cuál es la mejor opción para que tus empleados trabajen desde casa con seguridad.',
    fullContent: 'La elección depende de la infraestructura y el nivel de seguridad requerido.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    author: 'Ciberseguridad SI'
  },
  {
    id: '18',
    title: 'Mantenimiento Preventivo: El secreto de la longevidad tecnológica',
    date: '30 Mar, 2025',
    excerpt: 'Por qué esperar a que algo falle es el error más costoso que puedes cometer.',
    fullContent: 'Un chequeo semestral puede ahorrarte miles de pesos en reparaciones de emergencia.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte SI'
  }
];

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
  email: 'soporte@servicios-informaticos.com',
  whatsapp: '+543513810411',
  facebook: 'https://facebook.com/servinformaticos',
  instagram: 'https://instagram.com/servinformaticos',
  appointmentOnly: false,
  hours: {
    week: '09:00 - 18:00',
    sat: '10:00 - 14:00',
    sun: 'Cerrado'
  }
};

const defaultPortfolio: any[] = [
  {
    id: 'p1',
    title: 'E-commerce Moda Sostenible',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Stripe', 'Node.js'],
    description: 'Tienda online completa con pasarela de pagos y gestión de stock en tiempo real.',
    challenge: 'La tienda perdía ventas por un proceso de checkout lento y falta de stock actualizado.',
    solution: 'Implementamos una SPA (Single Page Application) con sincronización en tiempo real y pasarela segura.',
    result: 'Incremento del 45% en la tasa de conversión durante los primeros 3 meses.'
  },
  {
    id: 'p2',
    title: 'Portal Médico con Chatbot AI',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    tags: ['Soporte SI AI', 'Tailwind', 'Next.js'],
    description: 'Sistema de reserva de turnos con asistente virtual que triaje los síntomas básicos.',
    challenge: 'Saturación en las líneas telefónicas por consultas básicas sobre horarios y síntomas.',
    solution: 'Desarrollamos un asistente con Gemini AI capaz de agendar turnos y responder dudas frecuentes.',
    result: 'Reducción del 60% en llamadas administrativas no críticas.'
  },
  {
    id: 'p3',
    title: 'Red Corporativa para Estudio Contable',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    tags: ['Networking', 'Security', 'VPN'],
    description: 'Implementación de red segura con acceso remoto para empleados.',
    challenge: 'El estudio necesitaba que sus contadores trabajaran desde casa accediendo al servidor local de forma segura.',
    solution: 'Configuramos una VPN Site-to-Client con cifrado de grado militar y segmentación de red.',
    result: 'Continuidad operativa total durante la transición al trabajo híbrido.'
  },
  {
    id: 'p4',
    title: 'Recuperación de Datos Críticos',
    image: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80',
    tags: ['Data Recovery', 'Forensics'],
    description: 'Recuperación exitosa de base de datos de 10 años de antigüedad.',
    challenge: 'Un fallo eléctrico quemó el controlador de un arreglo RAID 5, dejando inaccesible la facturación histórica.',
    solution: 'Realizamos un trasplante de placa controladora en cámara limpia y reconstrucción lógica del volumen.',
    result: 'Recuperación del 99.8% de los archivos críticos en menos de 48 horas.'
  },
  {
    id: 'p5',
    title: 'Migración a la Nube para Estudio Jurídico',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    tags: ['Cloud', 'Office 365', 'Security'],
    description: 'Digitalización total de expedientes y migración a entorno colaborativo seguro.',
    challenge: 'El estudio manejaba todo en papel y servidores físicos obsoletos con riesgo de pérdida.',
    solution: 'Implementamos Microsoft 365 con políticas de retención de datos y escaneo masivo de documentos.',
    result: 'Acceso instantáneo a expedientes desde cualquier lugar y ahorro del 40% en espacio físico.'
  },
  {
    id: 'p6',
    title: 'Seguridad Perimetral para Depósito Industrial',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    tags: ['CCTV', 'Alarms', 'IoT'],
    description: 'Sistema de vigilancia inteligente con detección de intrusos por IA.',
    challenge: 'Vandalismo recurrente en las zonas ciegas del depósito durante la noche.',
    solution: 'Instalamos cámaras térmicas con analítica de video que alerta directamente a la policía.',
    result: 'Cero incidentes de seguridad reportados en los últimos 6 meses.'
  }
];

const defaultSettings = {
  formEndpoint: '', // URL de Formspree o similar
  isMaintenanceMode: false
};

const defaultApps: any[] = [
  { id: 'a1', name: 'WinRAR', description: 'El compresor de archivos más popular y versátil.', url: 'https://www.winrar.es/descargas', icon: 'fa-file-zipper', category: 'utilidad' },
  { id: 'a2', name: 'JDownloader', description: 'Gestor de descargas de código abierto, potente y fácil de usar.', url: 'https://jdownloader.org/download/index', icon: 'fa-download', category: 'utilidad' },
  { id: 'a3', name: 'ReNamer', description: 'Herramienta muy potente y flexible para renombrar archivos en lote.', url: 'https://www.den4b.com/products/renamer', icon: 'fa-pen-to-square', category: 'utilidad' },
  { id: 'a4', name: 'VLC Media Player', description: 'Reproductor multimedia versátil que soporta casi cualquier formato.', url: 'https://www.videolan.org/vlc/', icon: 'fa-play-circle', category: 'multimedia' },
  { id: 'a5', name: 'Malwarebytes', description: 'Excelente herramienta para detectar y eliminar malware.', url: 'https://www.malwarebytes.com/mwb-download', icon: 'fa-shield-halved', category: 'seguridad' }
];

const notifyChange = (key: string) => {
  window.dispatchEvent(new CustomEvent('nexus_storage_update', { detail: { key } }));
};

// Firestore Sync Logic
const COLLECTIONS = {
  NEWS: 'nexus_news',
  SERVICES: 'nexus_services',
  CONTACT: 'nexus_contact',
  SETTINGS: 'nexus_settings',
  APPS: 'nexus_apps',
  PORTFOLIO: 'nexus_portfolio'
};

// Initialize listeners
export const initFirestoreSync = () => {
  Object.values(COLLECTIONS).forEach(collectionName => {
    onSnapshot(doc(db, "app_data", collectionName), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data().items || snapshot.data().value;
        localStorage.setItem(collectionName, JSON.stringify(data));
        notifyChange(collectionName.replace('nexus_', ''));
      }
    }, (error) => {
      console.error(`Firestore Sync Error for ${collectionName}:`, error);
    });
  });
};

export const storageService = {
  getNews: () => {
    const saved = localStorage.getItem('nexus_news');
    return saved ? JSON.parse(saved) : defaultNews;
  },
  saveNews: async (data: any[]) => {
    localStorage.setItem('nexus_news', JSON.stringify(data));
    notifyChange('news');
    await setDoc(doc(db, "app_data", COLLECTIONS.NEWS), { items: data });
  },
  getServices: () => {
    const saved = localStorage.getItem('nexus_services');
    return saved ? JSON.parse(saved) : defaultServices;
  },
  saveServices: async (data: any[]) => {
    localStorage.setItem('nexus_services', JSON.stringify(data));
    notifyChange('services');
    await setDoc(doc(db, "app_data", COLLECTIONS.SERVICES), { items: data });
  },
  getContact: () => {
    const saved = localStorage.getItem('nexus_contact');
    return saved ? JSON.parse(saved) : defaultContact;
  },
  saveContact: async (data: any) => {
    localStorage.setItem('nexus_contact', JSON.stringify(data));
    notifyChange('contact');
    await setDoc(doc(db, "app_data", COLLECTIONS.CONTACT), { value: data });
  },
  getSettings: () => {
    const saved = localStorage.getItem('nexus_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  },
  saveSettings: async (data: any) => {
    localStorage.setItem('nexus_settings', JSON.stringify(data));
    notifyChange('settings');
    await setDoc(doc(db, "app_data", COLLECTIONS.SETTINGS), { value: data });
  },
  getApps: () => {
    const saved = localStorage.getItem('nexus_apps');
    return saved ? JSON.parse(saved) : defaultApps;
  },
  saveApps: async (data: any[]) => {
    localStorage.setItem('nexus_apps', JSON.stringify(data));
    notifyChange('apps');
    await setDoc(doc(db, "app_data", COLLECTIONS.APPS), { items: data });
  },
  getPortfolio: () => {
    const saved = localStorage.getItem('nexus_portfolio');
    return saved ? JSON.parse(saved) : defaultPortfolio;
  },
  savePortfolio: async (data: any[]) => {
    localStorage.setItem('nexus_portfolio', JSON.stringify(data));
    notifyChange('portfolio');
    await setDoc(doc(db, "app_data", COLLECTIONS.PORTFOLIO), { items: data });
  },
  
  // Helper to upload initial data to Firestore if it's empty
  seedFirestore: async () => {
    try {
      const q = query(collection(db, "app_data"), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await setDoc(doc(db, "app_data", COLLECTIONS.NEWS), { items: defaultNews });
        await setDoc(doc(db, "app_data", COLLECTIONS.SERVICES), { items: defaultServices });
        await setDoc(doc(db, "app_data", COLLECTIONS.CONTACT), { value: defaultContact });
        await setDoc(doc(db, "app_data", COLLECTIONS.SETTINGS), { value: defaultSettings });
        await setDoc(doc(db, "app_data", COLLECTIONS.APPS), { items: defaultApps });
        await setDoc(doc(db, "app_data", COLLECTIONS.PORTFOLIO), { items: defaultPortfolio });
      }
    } catch (error) {
      console.error("Error seeding Firestore:", error);
    }
  }
};
