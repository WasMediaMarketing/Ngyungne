import { Types } from "mongoose";
import { Gallery } from "../models/gallery.model";
import {
  GalleryItem,
  GalleryItemInput,
  GalleryItemUpdate,
  IGalleryService,
} from "@/types/gallery";
import { connectToDatabase } from "../utils/mongodb";
import { deleteFile } from "@/lib/utils/deleteFile";

/**
 * Service for handling Gallery-related database operations
 */
export class GalleryService implements IGalleryService {
  constructor() {
    // Ensure database connection is established
    connectToDatabase();
  }

  /**
   * Creates a new gallery item
   * @param {GalleryItemInput} galleryItemData - The gallery item data
   * @returns {Promise<GalleryItem>} The created gallery item
   */
  async createGalleryItem(
    galleryItemData: GalleryItemInput
  ): Promise<GalleryItem> {
    try {
      const galleryItem = new Gallery(galleryItemData);
      await galleryItem.save();
      return galleryItem;
    } catch (error) {
      console.error("createGalleryItem service error:", error);
      throw error;
    }
  }

  /**
   * Gets all gallery items
   * @param {boolean} onlyVisible - Whether to retrieve only visible gallery items
   * @returns {Promise<GalleryItem[]>} The list of gallery items
   */
  async getGalleryItems(onlyVisible = false): Promise<GalleryItem[]> {
    try {
      const query = onlyVisible ? { isVisible: true } : {};
      const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });
      return galleryItems;
    } catch (error) {
      console.error("getGalleryItems service error:", error);
      throw error;
    }
  }

  /**
   * Gets a gallery item by ID
   * @param {Types.ObjectId | string} galleryItemId - The gallery item ID
   * @returns {Promise<GalleryItem | null>} The gallery item details or null if not found
   */
  async getGalleryItemById(
    galleryItemId: Types.ObjectId | string
  ): Promise<GalleryItem | null> {
    try {
      const galleryItem = await Gallery.findById(galleryItemId);
      return galleryItem;
    } catch (error) {
      console.error("getGalleryItemById service error:", error);
      throw error;
    }
  }

  /**
   * Updates a gallery item by ID
   * @param {Types.ObjectId | string} galleryItemId - The gallery item ID
   * @param {GalleryItemUpdate} galleryItemData - The gallery item data to update
   * @returns {Promise<GalleryItem | null>} The updated gallery item or null if not found
   */
  async updateGalleryItem(
    galleryItemId: Types.ObjectId | string,
    galleryItemData: GalleryItemUpdate
  ): Promise<GalleryItem | null> {
    try {
      const galleryItem = await Gallery.findByIdAndUpdate(
        galleryItemId,
        { $set: galleryItemData },
        { new: true }
      );
      return galleryItem;
    } catch (error) {
      console.error("updateGalleryItem service error:", error);
      throw error;
    }
  }

  /**
   * Updates a gallery item's visibility by ID
   * @param {Types.ObjectId | string} galleryItemId - The gallery item ID
   * @param {boolean} isVisible - The visibility status to set
   * @returns {Promise<GalleryItem | null>} The updated gallery item or null if not found
   */
  async updateGalleryItemVisibility(
    galleryItemId: Types.ObjectId | string,
    isVisible: boolean
  ): Promise<GalleryItem | null> {
    try {
      const galleryItem = await Gallery.findByIdAndUpdate(
        galleryItemId,
        { $set: { isVisible } },
        { new: true }
      );
      return galleryItem;
    } catch (error) {
      console.error("updateGalleryItemVisibility service error:", error);
      throw error;
    }
  }

  /**
   * Deletes a gallery item by ID
   * @param {Types.ObjectId | string} galleryItemId - The gallery item ID
   * @returns {Promise<GalleryItem | null>} The deleted gallery item or null if not found
   */
  async deleteGalleryItem(
    galleryItemId: Types.ObjectId | string
  ): Promise<GalleryItem | null> {
    try {
      const galleryItem = await Gallery.findByIdAndDelete(galleryItemId);

      // Delete associated files if the item was found and deleted
      if (galleryItem) {
        // Delete main image
        if (galleryItem.image && galleryItem.image.startsWith("/uploads/")) {
          await deleteFile(galleryItem.image);
        }

        // Delete additional images
        if (
          galleryItem.additionalImages &&
          galleryItem.additionalImages.length > 0
        ) {
          for (const image of galleryItem.additionalImages) {
            if (image.startsWith("/uploads/")) {
              await deleteFile(image);
            }
          }
        }
      }

      return galleryItem;
    } catch (error) {
      console.error("deleteGalleryItem service error:", error);
      throw error;
    }
  }

  /**
   * Deletes multiple gallery items by their IDs
   * @param {(Types.ObjectId | string)[]} galleryItemIds - The gallery item IDs
   * @returns {Promise<boolean>} Whether the gallery items were deleted successfully
   */
  async deleteGalleryItems(
    galleryItemIds: (Types.ObjectId | string)[]
  ): Promise<boolean> {
    try {
      // First, get all items to be deleted so we can clean up their files
      const itemsToDelete = await Gallery.find({
        _id: { $in: galleryItemIds },
      });

      // Delete the items from the database
      const result = await Gallery.deleteMany({ _id: { $in: galleryItemIds } });

      // If items were deleted, clean up their files
      if (result.deletedCount > 0 && itemsToDelete.length > 0) {
        for (const item of itemsToDelete) {
          // Delete main image
          if (item.image && item.image.startsWith("/uploads/")) {
            await deleteFile(item.image);
          }

          // Delete additional images
          if (item.additionalImages && item.additionalImages.length > 0) {
            for (const image of item.additionalImages) {
              if (image.startsWith("/uploads/")) {
                await deleteFile(image);
              }
            }
          }
        }
      }

      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteGalleryItems service error:", error);
      throw error;
    }
  }
}
