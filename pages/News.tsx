
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

// Mantenemos la data por defecto para la primera carga
export const newsData = [
  {
    id: '1',
    title: 'Cómo proteger tu red Wi-Fi doméstica de intrusos',
    date: '15 Oct, 2024',
    excerpt: 'Cinco pasos fundamentales para configurar tu router y evitar que extraños accedan a tu conexión.',
    fullContent: `Proteger tu red inalámbrica es el primer paso para asegurar tu vida digital.`,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    author: 'Admin Nexus'
  },
  {
    id: '2',
    title: 'Windows 11: ¿Vale la pena actualizar ahora?',
    date: '02 Oct, 2024',
    excerpt: 'Analizamos las ventajas y desventajas del nuevo sistema operativo para pequeños emprendimientos.',
    fullContent: `Windows 11 ha madurado significativamente desde su lanzamiento.`,
    image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&w=800&q=80',
    author: 'Equipo Técnico'
  },
  {
    id: '3',
    title: 'La importancia del Backup en la nube para tu negocio',
    date: '20 Sep, 2024',
    excerpt: 'Por qué no deberías confiar solo en un disco duro externo para guardar tu información vital.',
    fullContent: `El error más común de los pequeños negocios es pensar que un disco externo "es suficiente".`,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    author: 'Consultoría Nexus'
  },
  {
    id: '4',
    title: '5 Señales de que tu PC necesita una limpieza interna',
    date: '10 Nov, 2024',
    excerpt: 'El polvo y la falta de mantenimiento térmico pueden matar tus componentes.',
    fullContent: `Muchos usuarios ignoran el mantenimiento físico de sus computadoras.`,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    author: 'Soporte Técnico'
  },
  {
    id: '5',
    title: 'IA en pequeños negocios: Cómo ChatGPT ayuda a vender',
    date: '28 Nov, 2024',
    excerpt: 'Descubre cómo automatizar tu atención al cliente con inteligencia artificial.',
    fullContent: `La democratización de la IA permite que un almacén compita con grandes firmas.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    author: 'Área de Innovación'
  },
  {
    id: '6',
    title: 'Ciberseguridad 2025: Por qué el 2FA ya no es opcional',
    date: '05 Dic, 2024',
    excerpt: 'La autenticación en dos pasos es la barrera más efectiva contra el robo de cuentas.',
    fullContent: `Las contraseñas ya no son suficientes. Los ataques de phishing son cada vez más sofisticados.`,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    author: 'Ciberseguridad Nexus'
  }
];

const News: React.FC = () => {
  const [currentNews, setCurrentNews] = useState<any[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    setCurrentNews(storageService.getNews());
  }, []);

  const handleShare = async (item: any) => {
    const shareUrl = `${window.location.origin}/#/noticias/${item.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, url: shareUrl }); } 
      catch (err) { copyToClipboard(shareUrl, item.id); }
    } else {
      copyToClipboard(shareUrl, item.id);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus(id);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <div className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Noticias y Consejos</h1>
            <p className="text-slate-600">Mantente al día con lo último en tecnología.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentNews.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 150} variant="up">
              <article className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-sm font-medium text-blue-600">{item.date}</span>
                  <h3 className="text-xl font-bold mt-2 mb-4 leading-tight line-clamp-2">{item.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{item.excerpt}</p>
                  <div className="flex gap-2 mt-auto">
                    <Link to={`/noticias/${item.id}`} className="flex-grow px-6 py-3 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center">Leer más</Link>
                    <button onClick={() => handleShare(item)} className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all relative">
                      <i className={`fa-solid ${copyStatus === item.id ? 'fa-check text-green-500' : 'fa-share-nodes'}`}></i>
                    </button>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
