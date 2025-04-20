import { Meditation } from "@/lib/models/meditation.model";
import {
  IMeditationInput,
  IMeditationUpdate,
  IMeditation,
  IMeditationService,
} from "@/types/meditation.types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile"; // Import the deleteFile utility

export class MeditationService implements IMeditationService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new meditation in the system
   * @param {IMeditationInput} meditationData - Data to create the meditation
   * @returns {Promise<IMeditation>} The created meditation
   */
  async createMeditation(
    meditationData: IMeditationInput
  ): Promise<IMeditation> {
    await this.initializeDbConnection();
    const meditation = new Meditation({
      ...meditationData,
      views: meditationData.views || 0,
      favorites: meditationData.favorites || 0,
      sessions: meditationData.sessions || 0,
    });
    await meditation.save();
    return meditation;
  }

  /**
   * @description Retrieves all meditations in the system
   * @param {boolean} isVisible - Optional filter for visible meditations only
   * @returns {Promise<IMeditation[]>} List of all meditations
   */
  async getMeditations(isVisible?: boolean): Promise<IMeditation[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await Meditation.find({ isVisible: true });
    }
    return await Meditation.find();
  }

  /**
   * @description Retrieves a single meditation by its ID
   * @param {Types.ObjectId} meditationId - The ID of the meditation to retrieve
   * @returns {Promise<IMeditation | null>} The meditation found or null if not found
   */
  async getMeditationById(
    meditationId: Types.ObjectId
  ): Promise<IMeditation | null> {
    await this.initializeDbConnection();
    const meditation = await Meditation.findById(meditationId);
    if (!meditation) throw new Error("Meditation not found");
    return meditation;
  }

  /**
   * @description Updates a meditation by its ID
   * @param {Types.ObjectId} meditationId - The ID of the meditation to update
   * @param {IMeditationUpdate} meditationData - The data to update the meditation
   * @returns {Promise<IMeditation | null>} The updated meditation
   */
  async updateMeditation(
    meditationId: Types.ObjectId,
    meditationData: IMeditationUpdate
  ): Promise<IMeditation | null> {
    await this.initializeDbConnection();
    const existingMeditation = await Meditation.findById(meditationId);
    if (!existingMeditation) {
      throw new Error("Meditation Not Found");
    }

    // Handle image deletion if new image is provided
    if (
      meditationData.image &&
      meditationData.image !== existingMeditation.image &&
      existingMeditation.image
    ) {
      deleteFile(existingMeditation.image); // Delete old image if new one is provided
    }

    // Handle audio file deletion if new audio is provided
    if (
      meditationData.audioFile &&
      meditationData.audioFile !== existingMeditation.audioFile &&
      existingMeditation.audioFile
    ) {
      deleteFile(existingMeditation.audioFile); // Delete old audio file if new one is provided
    }

    const meditation = await Meditation.findByIdAndUpdate(
      meditationId,
      meditationData,
      {
        new: true,
      }
    );
    if (!meditation) throw new Error("Meditation not found");
    return meditation;
  }

  /**
   * @description Deletes a meditation by its ID
   * @param {Types.ObjectId} meditationId - The ID of the meditation to delete
   * @returns {Promise<IMeditation | null>} The deleted meditation
   */
  async deleteMeditation(
    meditationId: Types.ObjectId
  ): Promise<IMeditation | null> {
    await this.initializeDbConnection();

    // Find the meditation to get its image and audio paths (if exists)
    const meditation = await Meditation.findById(meditationId);
    if (!meditation) throw new Error("Meditation not found");

    // If there's an image, delete it
    if (meditation.image) {
      deleteFile(meditation.image); // Delete the image file from the file system
    }

    // If there's an audio file, delete it
    if (meditation.audioFile) {
      deleteFile(meditation.audioFile); // Delete the audio file from the file system
    }

    // Now delete the meditation from the database
    const deletedMeditation = await Meditation.findByIdAndDelete(meditationId);
    return deletedMeditation;
  }

  /**
   * @description Deletes multiple meditations by their IDs
   * @param {Types.ObjectId[]} meditationIds - Array of meditation IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteMeditations(meditationIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all meditations to get their image and audio paths (if exists)
    const meditations = await Meditation.find({ _id: { $in: meditationIds } });
    if (meditations.length === 0) throw new Error("No meditations found");

    // Delete images and audio files for all meditations
    meditations.forEach((meditation) => {
      if (meditation.image) {
        deleteFile(meditation.image); // Delete each meditation's image from the file system
      }
      if (meditation.audioFile) {
        deleteFile(meditation.audioFile); // Delete each meditation's audio file from the file system
      }
    });

    // Delete the meditations from the database
    const deletedMeditations = await Meditation.deleteMany({
      _id: { $in: meditationIds },
    });
    return deletedMeditations;
  }

  /**
   * @description Increments the view count for a meditation
   * @param {Types.ObjectId} meditationId - The ID of the meditation
   * @returns {Promise<IMeditation | null>} The updated meditation
   */
  async incrementViews(
    meditationId: Types.ObjectId
  ): Promise<IMeditation | null> {
    await this.initializeDbConnection();
    const meditation = await Meditation.findByIdAndUpdate(
      meditationId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!meditation) throw new Error("Meditation not found");
    return meditation;
  }
}
