export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  date: Date;
  readTime: string;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  category: string;
  tags: string[];
  content: string | ContentItem[];
  related: number[];
  views: number;
  likes: number;
  comments: number;
  image: string;
}

export interface ContentItem {
  type: string;
  content?: string;
  level?: number;
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  poster?: string;
  items?: string[];
}
