
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { storageService } from '../services/storageService';

const Home: React.FC = () => {
  const contact = storageService.getContact();

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
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" 
                alt="Servicio IT Profesional" 
                className="rounded-2xl shadow-2xl relative z-10 w-full h-[400px] object-cover transform hover:rotate-1 transition-transform duration-500"
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

      {/* Social/Facebook Integration Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="lg:w-1/2 z-10">
              <ScrollReveal variant="left">
                <span className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4 block">Nuestra Comunidad</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Únete a nuestra página de Facebook</h2>
                <p className="text-slate-400 text-lg mb-8">
                  Compartimos consejos diarios de ciberseguridad, trucos para acelerar tu PC y las últimas noticias del mundo tecnológico. ¡Forma parte de los más de 500 seguidores!
                </p>
                {contact.facebook && (
                  <a 
                    href={contact.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#1877F2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#166fe5] transition-all transform hover:scale-105"
                  >
                    <i className="fa-brands fa-facebook text-xl"></i>
                    Seguir en Facebook
                  </a>
                )}
              </ScrollReveal>
            </div>

            <div className="lg:w-1/2 z-10 flex justify-center">
              <ScrollReveal variant="right" delay={200}>
                <div className="bg-white p-4 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 max-w-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Servicios Informáticos</p>
                      <p className="text-[10px] text-slate-500">Hace 2 horas • <i className="fa-solid fa-earth-americas"></i></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mb-4">
                    ¿Tu computadora hace mucho ruido? 🌪️ Podría ser falta de mantenimiento. ¡Mira este tip para cuidar tus ventiladores! #SoporteTecnico #PCGaming
                  </p>
                  <div className="bg-slate-100 rounded-xl h-40 flex items-center justify-center border border-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80" alt="Tip Post" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 text-slate-400 text-[10px]">
                    <div className="flex gap-4">
                      <span><i className="fa-regular fa-thumbs-up"></i> Me gusta</span>
                      <span><i className="fa-regular fa-comment"></i> Comentar</span>
                    </div>
                    <span><i className="fa-solid fa-share"></i> Compartir</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
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
