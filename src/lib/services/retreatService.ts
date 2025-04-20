import { Retreat } from "@/lib/models";
import {
  IRetreatInput,
  IRetreatUpdate,
  IRetreat,
  IRetreatService,
} from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";

export class RetreatService implements IRetreatService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new retreat in the system
   * @param {IRetreatInput} retreatData - Data to create the retreat
   * @returns {Promise<IRetreat>} The created retreat
   */
  async createRetreat(retreatData: IRetreatInput): Promise<IRetreat> {
    await this.initializeDbConnection();
    const retreat = new Retreat({
      ...retreatData,
      participants: retreatData.participants || "0",
    });
    await retreat.save();
    return retreat;
  }

  /**
   * @description Retrieves all retreats in the system
   * @param {boolean} isVisible - If true, retrieves only visible retreats
   * @returns {Promise<IRetreat[]>} List of all retreats
   */
  async getRetreats(isVisible?: boolean): Promise<IRetreat[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await Retreat.find({ isVisible: true });
    }
    return await Retreat.find();
  }

  /**
   * @description Retrieves a single retreat by its ID
   * @param {Types.ObjectId} retreatId - The ID of the retreat to retrieve
   * @returns {Promise<IRetreat | null>} The retreat found or null if not found
   */
  async getRetreatById(retreatId: Types.ObjectId): Promise<IRetreat | null> {
    await this.initializeDbConnection();
    const retreat = await Retreat.findById(retreatId);
    if (!retreat) throw new Error("Retreat not found");
    return retreat;
  }

  /**
   * @description Updates a retreat by its ID
   * @param {Types.ObjectId} retreatId - The ID of the retreat to update
   * @param {IRetreatUpdate} retreatData - The data to update the retreat
   * @returns {Promise<IRetreat | null>} The updated retreat
   */
  async updateRetreat(
    retreatId: Types.ObjectId,
    retreatData: IRetreatUpdate
  ): Promise<IRetreat | null> {
    await this.initializeDbConnection();
    const existingRetreat = await Retreat.findById(retreatId);
    if (!existingRetreat) {
      throw new Error("Retreat Not Found");
    }

    const retreat = await Retreat.findByIdAndUpdate(retreatId, retreatData, {
      new: true,
    });
    if (!retreat) throw new Error("Retreat not found");
    return retreat;
  }

  /**
   * @description Deletes a retreat by its ID
   * @param {Types.ObjectId} retreatId - The ID of the retreat to delete
   * @returns {Promise<IRetreat | null>} The deleted retreat
   */
  async deleteRetreat(retreatId: Types.ObjectId): Promise<IRetreat | null> {
    await this.initializeDbConnection();

    // Find the retreat to get its image path (if exists)
    const retreat = await Retreat.findById(retreatId);
    if (!retreat) throw new Error("Retreat not found");

    // Now delete the retreat from the database
    const deletedRetreat = await Retreat.findByIdAndDelete(retreatId);
    return deletedRetreat;
  }

  /**
   * @description Deletes multiple retreats by their IDs
   * @param {Types.ObjectId[]} retreatIds - Array of retreat IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteRetreats(retreatIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all retreats to get their image paths (if exists)
    const retreats = await Retreat.find({ _id: { $in: retreatIds } });
    if (retreats.length === 0) throw new Error("No retreats found");

    // Delete the retreats from the database
    const deletedRetreats = await Retreat.deleteMany({
      _id: { $in: retreatIds },
    });
    return deletedRetreats;
  }
}
