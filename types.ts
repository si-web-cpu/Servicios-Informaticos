
export interface Service {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: 'hogar' | 'negocios';
  info?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  date: string;
  image: string;
  author?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  appointmentOnly?: boolean;
  hours: {
    week: string;
    sat: string;
    sun: string;
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  result: string;
}

export interface UsefulApp {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: 'utilidad' | 'multimedia' | 'seguridad' | 'otros';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
