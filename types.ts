
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
  hours: {
    week: string;
    sat: string;
    sun: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
