import { Types } from "mongoose";

export enum GalleryItemType {
  PHOTO = "photo",
  VIDEO = "video",
}

export interface GalleryItem {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  fullDescription?: string;
  type: GalleryItemType;
  image?: string; // Main image for photos or thumbnail for videos
  videoUrl?: string; // URL for videos
  additionalImages?: string[]; // Additional images for the gallery item
  tags?: string[];
  date?: Date;
  location?: string;
  photographer?: string;
  presenter?: string;
  event?: string;
  duration?: string; // For videos
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryItemInput {
  title: string;
  description: string;
  fullDescription?: string;
  type: GalleryItemType;
  image?: string;
  videoUrl?: string;
  additionalImages?: string[];
  tags?: string[];
  date?: Date;
  location?: string;
  photographer?: string;
  presenter?: string;
  event?: string;
  duration?: string;
  isVisible?: boolean;
}

export interface GalleryItemUpdate {
  title?: string;
  description?: string;
  fullDescription?: string;
  type?: GalleryItemType;
  image?: string;
  videoUrl?: string;
  additionalImages?: string[];
  tags?: string[];
  date?: Date;
  location?: string;
  photographer?: string;
  presenter?: string;
  event?: string;
  duration?: string;
  isVisible?: boolean;
}

export interface IGalleryService {
  createGalleryItem(galleryItemData: GalleryItemInput): Promise<GalleryItem>;
  getGalleryItems(onlyVisible?: boolean): Promise<GalleryItem[]>;
  getGalleryItemById(
    galleryItemId: Types.ObjectId | string
  ): Promise<GalleryItem | null>;
  updateGalleryItem(
    galleryItemId: Types.ObjectId | string,
    galleryItemData: GalleryItemUpdate
  ): Promise<GalleryItem | null>;
  updateGalleryItemVisibility(
    galleryItemId: Types.ObjectId | string,
    isVisible: boolean
  ): Promise<GalleryItem | null>;
  deleteGalleryItem(
    galleryItemId: Types.ObjectId | string
  ): Promise<GalleryItem | null>;
  deleteGalleryItems(
    galleryItemIds: (Types.ObjectId | string)[]
  ): Promise<boolean>;
}
