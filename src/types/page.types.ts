import type { Types } from "mongoose";

export interface Page {
  id: string;
  _id: Types.ObjectId;
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  lastUpdated?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  location?: "header" | "footer";
  parentPage?: string;
  content?: string;
  status?: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

export interface IPageService {
  createPage(pageData: CreatePageInput): Promise<Page>;
  getPages(): Promise<Page[]>;
  getPublishedPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | null>;
  updatePage(pageId: string, pageData: UpdatePageInput): Promise<Page | null>;
  deletePage(pageId: string): Promise<Page | null>;
  deletePages(pageIds: string[]): Promise<{ deletedCount: number }>;
}
