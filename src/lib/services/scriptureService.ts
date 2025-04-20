import { Scripture } from "@/lib/models/scripture.model";
import type {
  IScriptureInput,
  IScriptureUpdate,
  IScripture,
  IScriptureService,
} from "@/types/scripture.types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import type { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile";

export class ScriptureService implements IScriptureService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new scripture in the system
   * @param {IScriptureInput} scriptureData - Data to create the scripture
   * @returns {Promise<IScripture>} The created scripture
   */
  async createScripture(scriptureData: IScriptureInput): Promise<IScripture> {
    await this.initializeDbConnection();
    const scripture = new Scripture({
      ...scriptureData,
      views: scriptureData.views || 0,
    });
    await scripture.save();
    return scripture;
  }

  /**
   * @description Retrieves all scriptures in the system
   * @param {boolean} isVisible - Optional filter for visible scriptures only
   * @returns {Promise<IScripture[]>} List of all scriptures
   */
  async getScriptures(isVisible?: boolean): Promise<IScripture[]> {
    await this.initializeDbConnection();
    if (isVisible !== undefined) {
      return await Scripture.find({ isVisible: isVisible });
    }
    return await Scripture.find();
  }

  /**
   * @description Retrieves a single scripture by its ID
   * @param {Types.ObjectId} scriptureId - The ID of the scripture to retrieve
   * @returns {Promise<IScripture | null>} The scripture found or null if not found
   */
  async getScriptureById(
    scriptureId: Types.ObjectId
  ): Promise<IScripture | null> {
    await this.initializeDbConnection();
    const scripture = await Scripture.findById(scriptureId);
    if (!scripture) throw new Error("Scripture not found");
    console.log("result of scripture service get", scripture);
    return scripture;
  }

  /**
   * @description Updates a scripture by its ID
   * @param {Types.ObjectId} scriptureId - The ID of the scripture to update
   * @param {IScriptureUpdate} scriptureData - The data to update the scripture
   * @returns {Promise<IScripture | null>} The updated scripture
   */
  async updateScripture(
    scriptureId: Types.ObjectId,
    scriptureData: IScriptureUpdate
  ): Promise<IScripture | null> {
    await this.initializeDbConnection();
    const existingScripture = await Scripture.findById(scriptureId);
    if (!existingScripture) {
      throw new Error("Scripture Not Found");
    }

    // Handle image deletion if new image is provided
    if (
      scriptureData.image &&
      scriptureData.image !== existingScripture.image &&
      existingScripture.image
    ) {
      deleteFile(existingScripture.image); // Delete old image if new one is provided
    }

    const scripture = await Scripture.findByIdAndUpdate(
      scriptureId,
      scriptureData,
      {
        new: true,
      }
    );
    if (!scripture) throw new Error("Scripture not found");
    return scripture;
  }

  /**
   * @description Deletes a scripture by its ID
   * @param {Types.ObjectId} scriptureId - The ID of the scripture to delete
   * @returns {Promise<IScripture | null>} The deleted scripture
   */
  async deleteScripture(
    scriptureId: Types.ObjectId
  ): Promise<IScripture | null> {
    await this.initializeDbConnection();

    // Find the scripture to get its image path (if exists)
    const scripture = await Scripture.findById(scriptureId);
    if (!scripture) throw new Error("Scripture not found");

    // If there's an image, delete it
    if (scripture.image) {
      deleteFile(scripture.image); // Delete the image file from the file system
    }

    // Now delete the scripture from the database
    const deletedScripture = await Scripture.findByIdAndDelete(scriptureId);
    return deletedScripture;
  }

  /**
   * @description Deletes multiple scriptures by their IDs
   * @param {Types.ObjectId[]} scriptureIds - Array of scripture IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteScriptures(scriptureIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all scriptures to get their image paths (if exists)
    const scriptures = await Scripture.find({ _id: { $in: scriptureIds } });
    if (scriptures.length === 0) throw new Error("No scriptures found");

    // Delete images for all scriptures
    scriptures.forEach((scripture) => {
      if (scripture.image) {
        deleteFile(scripture.image); // Delete each scripture's image from the file system
      }
    });

    // Delete the scriptures from the database
    const deletedScriptures = await Scripture.deleteMany({
      _id: { $in: scriptureIds },
    });
    return deletedScriptures;
  }
}
