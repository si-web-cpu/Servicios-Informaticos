
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const Home: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <ScrollReveal variant="left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Tecnología al <span className="text-blue-600">Servicio de tu Hogar</span> y Negocio
              </h1>
              <p className="mt-6 text-xl text-slate-600 max-w-2xl">
                Servicios informáticos profesionales, rápidos y confiables para particulares y pequeños emprendedores. Reparamos, instalamos y protegemos tu mundo digital.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/servicios" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all text-center shadow-lg shadow-blue-200">
                  Ver Servicios
                </Link>
                <Link to="/contacto" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all text-center">
                  Solicitar Soporte
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="right" delay={200} className="mt-12 lg:mt-0 relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <img 
                src="https://picsum.photos/id/1/800/600" 
                alt="Servicio IT" 
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover transform hover:rotate-1 transition-transform duration-500"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">¿Por qué elegirnos?</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-gauge-high', title: 'Rapidez Garantizada', desc: 'Entendemos que tu tiempo es valioso. Respondemos en tiempo récord.' },
              { icon: 'fa-shield-halved', title: 'Seguridad Total', desc: 'Protegemos tus datos y equipos con los más altos estándares.' },
              { icon: 'fa-microchip', title: 'Expertos Senior', desc: 'Contamos con años de experiencia en el sector tecnológico.' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="up">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group h-full">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="scale">
            <div className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <i className="fa-solid fa-code text-9xl"></i>
               </div>
               <h2 className="text-3xl font-bold mb-6">¿Tu computadora está lenta o necesitas armar una red?</h2>
               <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Nuestro equipo está listo para ayudarte con cualquier desafío técnico que enfrentes en tu casa u oficina.</p>
               <Link to="/contacto" className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors inline-block">
                 Hablemos Hoy
               </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
