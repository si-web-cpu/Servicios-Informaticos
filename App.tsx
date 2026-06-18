
import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { initFirestoreSync, storageService } from './services/storageService';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Automation = lazy(() => import('./pages/Automation'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const UsefulApps = lazy(() => import('./pages/UsefulApps'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Firestore real-time sync
    initFirestoreSync();
    
    // Seed Firestore with default data if it's the first time
    storageService.seedFirestore().catch(console.error);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/planes" element={<Pricing />} />
              <Route path="/automatizaciones" element={<Automation />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/noticias/:id" element={<NewsDetail />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/aplicaciones" element={<UsefulApps />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
