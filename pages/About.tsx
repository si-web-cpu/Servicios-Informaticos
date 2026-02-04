
import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <ScrollReveal className="lg:w-1/2" variant="left">
            <h1 className="text-4xl font-bold text-slate-900 mb-6 underline decoration-blue-600 decoration-4 underline-offset-8">Quiénes Somos</h1>
            <p className="text-lg text-slate-600 mb-6">
              En <span className="font-bold text-blue-600">Servicios Informáticos</span>, nacimos con la misión de democratizar el acceso al soporte técnico de alta calidad. Creemos que no hace falta ser una multinacional para tener sistemas eficientes, seguros y modernos.
            </p>
            <p className="text-lg text-slate-600 mb-6">
              Desde hace más de 25 años, brindamos asistencia personalizada a cientos de hogares y pequeños emprendimientos que buscaban un socio tecnológico de confianza. No solo reparamos equipos, construimos relaciones de largo plazo.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-3xl font-bold text-slate-900">150+</h4>
                <p className="text-slate-500">Clientes Felices</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-3xl font-bold text-slate-900">1200+</h4>
                <p className="text-slate-500">Tickets Resueltos</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal className="lg:w-1/2" variant="right" delay={200}>
            <div className="relative">
              <img 
                src="https://picsum.photos/id/2/800/800" 
                alt="Nuestro Equipo" 
                className="rounded-3xl shadow-2xl"
              />
              <ScrollReveal delay={500} variant="up" className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Calidad Certificada</p>
                    <p className="text-sm text-slate-500">Garantía en todos los trabajos</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Nuestra Misión', icon: 'fa-bullseye', desc: 'Brindar soluciones tecnológicas accesibles y eficientes que impulsen el crecimiento de nuestros clientes.' },
            { title: 'Nuestra Visión', icon: 'fa-eye', desc: 'Ser el referente número uno en soporte informático para microempresas y hogares en la región.' },
            { title: 'Nuestros Valores', icon: 'fa-heart', desc: 'Honestidad, transparencia, innovación constante y compromiso con la satisfacción del usuario.' },
          ].map((v, i) => (
            <ScrollReveal key={i} delay={i * 200} variant="up">
              <div className="bg-white border border-slate-200 p-10 rounded-3xl hover:border-blue-300 transition-colors h-full">
                <i className={`fa-solid ${v.icon} text-3xl text-blue-600 mb-6`}></i>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
