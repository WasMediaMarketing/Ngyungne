import { Types, Document } from "mongoose";

// Author interface for BlogPost author information
export interface IAuthor {
  name: string;
  image: string;
  bio: string;
}

// BlogPostInput: Interface for creating a new BlogPost
export interface IBlogPostInput {
  title: string;
  description?: string;
  date: Date;
  readTime?: string;
  author: IAuthor; // Author information required for a new blog post
  tags?: string[];
  categories?: string[];
  content: string;
  image: string;
  views?: number;
  isVisible?: boolean; // Optional visibility flag
}

// BlogPostUpdate: Interface for updating an existing BlogPost
export interface IBlogPostUpdate {
  title?: string;
  description?: string;
  date?: Date;
  readTime?: string;
  author?: IAuthorUpdate; // Author can be updated as well
  tags?: string[];
  categories?: string[];
  content?: string;
  image?: string;
  views?: number;
  isVisible?: boolean; // Optional visibility flag
}
export interface IAuthorUpdate {
  name?: string;
  image?: string;
  bio?: string;
}
export interface IBlogPost extends Document {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  readTime?: string;
  author: IAuthor; // Author is required
  tags: string[];
  categories: string[];
  content: string;
  image: string;
  views: number;
  isVisible: boolean; // Visibility flag to mark if the blog post is visible
}
