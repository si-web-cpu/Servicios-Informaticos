
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const allNews = storageService.getNews();
    const found = allNews.find((n: any) => n.id === id);
    setArticle(found);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800">Artículo no encontrado</h2>
        <p className="text-slate-500 mt-2">Es posible que el artículo haya sido eliminado o movido.</p>
        <Link to="/noticias" className="text-blue-600 font-bold hover:underline mt-6 inline-block">Volver a noticias</Link>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-20 bg-white">
      {/* Hero Header */}
      <div className="w-full h-[50vh] relative overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <ScrollReveal variant="up">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                Blog Servicios Informáticos
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {article.title}
              </h1>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-grow">
            <ScrollReveal className="flex items-center gap-4 text-slate-500 text-sm mb-8 border-b border-slate-50 pb-6">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-calendar-days text-blue-600"></i>
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user text-blue-600"></i>
                <span>{article.author || 'Equipo SI'}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium italic border-l-4 border-blue-100 pl-6">
                {article.excerpt}
              </p>
              <div className="text-slate-800 leading-relaxed space-y-6 text-lg markdown-content">
                {article.fullContent ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                      u: ({node, ...props}) => <u className="underline" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline font-bold" {...props} />,
                      img: ({node, ...props}) => <img className="w-full rounded-2xl my-8 shadow-lg" referrerPolicy="no-referrer" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    }}
                  >
                    {article.fullContent}
                  </ReactMarkdown>
                ) : (
                  'Este artículo no tiene contenido extendido disponible.'
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal className="mt-16 pt-8 border-t border-slate-100">
              <button 
                onClick={() => navigate('/noticias')}
                className="group flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-all"
              >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver a la lista de noticias
              </button>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <ScrollReveal variant="right" className="sticky top-24 space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-3">¿Necesitas ayuda?</h4>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">Si tienes problemas con lo mencionado en este artículo, nuestro equipo puede asesorarte profesionalmente.</p>
                <Link to="/contacto" className="block text-center bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                  Contactar Soporte
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
