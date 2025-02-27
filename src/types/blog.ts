export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string | { content: string; type: string }[];
  date: string;
  author: {
    name: string;
    image: string;
    title: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  image: string;
  slug: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  description?: string; // Make optional
  related?: BlogPost[]; // Make optional
}
