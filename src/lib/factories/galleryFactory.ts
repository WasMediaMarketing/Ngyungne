import { GalleryService } from "@/lib/services/galleryService";
import { GalleryController } from "@/lib/controllers/galleryController";

/**
 * Creates and returns a new instance of the Gallery controller
 * @returns {GalleryController} A new Gallery controller instance
 */
export function createGalleryController() {
  const galleryService = new GalleryService();
  return new GalleryController(galleryService);
}
