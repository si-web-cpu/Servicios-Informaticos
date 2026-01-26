
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'hogar' | 'negocios';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  date: string;
  imageUrl: string;
  author?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
