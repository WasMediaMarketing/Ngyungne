import { Cause } from "@/lib/models";
import { ICauseInput, ICauseUpdate, ICause, ICauseService } from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile";

export class CauseService implements ICauseService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new cause in the system
   * @param {ICauseInput} causeData - Data to create the cause
   * @returns {Promise<ICause>} The created cause
   */
  async createCause(causeData: ICauseInput): Promise<ICause> {
    await this.initializeDbConnection();
    const cause = new Cause({
      ...causeData,
    });
    await cause.save();
    return cause;
  }

  /**
   * @description Retrieves all causes in the system
   * @returns {Promise<ICause[]>} List of all causes
   */
  async getCauses(isVisible?: boolean): Promise<ICause[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await Cause.find({ isVisible: true });
    }
    return await Cause.find();
  }

  /**
   * @description Retrieves a single cause by its ID
   * @param {string} causeId - The ID of the cause to retrieve
   * @returns {Promise<ICause | null>} The cause found or null if not found
   */
  async getCauseById(causeId: Types.ObjectId): Promise<ICause | null> {
    await this.initializeDbConnection();
    const cause = await Cause.findById(causeId);
    if (!cause) throw new Error("Cause not found");
    return cause;
  }

  /**
   * @description Updates a cause by its ID
   * @param {string} causeId - The ID of the cause to update
   * @param {ICauseUpdate} causeData - The data to update the cause
   * @returns {Promise<ICause | null>} The updated cause
   */
  async updateCause(
    causeId: Types.ObjectId,
    causeData: ICauseUpdate
  ): Promise<ICause | null> {
    await this.initializeDbConnection();
    const existingCause = await Cause.findById(causeId);
    if (!existingCause) {
      throw new Error("Cause Not Found");
    }

    if (
      causeData.image &&
      causeData.image !== existingCause.image &&
      existingCause.image
    ) {
      deleteFile(existingCause.image);
    }

    if (causeData.gallery) {
      existingCause.gallery.forEach((image) => {
        if (!causeData.gallery!.includes(image)) {
          deleteFile(image);
        }
      });
    }

    const updatedCause = await Cause.findByIdAndUpdate(causeId, causeData, {
      new: true,
    });
    if (!updatedCause) throw new Error("Cause not found");
    return updatedCause;
  }

  /**
   * @description Deletes a cause by its ID
   * @param {string} causeId - The ID of the cause to delete
   * @returns {Promise<ICause | null>} The deleted cause
   */
  async deleteCause(causeId: Types.ObjectId): Promise<ICause | null> {
    await this.initializeDbConnection();

    const cause = await Cause.findById(causeId);
    if (!cause) throw new Error("Cause not found");

    if (cause.image) {
      deleteFile(cause.image);
    }

    if (cause.gallery?.length) {
      cause.gallery.forEach((image) => {
        deleteFile(image);
      });
    }

    const deletedCause = await Cause.findByIdAndDelete(causeId);
    return deletedCause;
  }

  /**
   * @description Deletes multiple causes by their IDs
   * @param {Types.ObjectId[]} causeIds - Array of cause IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteCauses(causeIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    const causes = await Cause.find({ _id: { $in: causeIds } });
    if (causes.length === 0) throw new Error("No causes found");

    causes.forEach((cause) => {
      if (cause.image) {
        deleteFile(cause.image);
      }

      if (cause.gallery?.length) {
        cause.gallery.forEach((image) => {
          deleteFile(image);
        });
      }
    });

    const deletedCauses = await Cause.deleteMany({ _id: { $in: causeIds } });
    return deletedCauses;
  }
}
