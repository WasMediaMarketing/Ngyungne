import { PhilosophyTopic } from "@/lib/models";
import {
  IPhilosophyTopicInput,
  IPhilosophyTopicUpdate,
  IPhilosophyTopic,
  IPhilosophyTopicService,
} from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";

export class PhilosophyTopicService implements IPhilosophyTopicService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new philosophy topic in the system
   * @param {IPhilosophyTopicInput} philosophyTopicData - Data to create the philosophy topic
   * @returns {Promise<IPhilosophyTopic>} The created philosophy topic
   */
  async createPhilosophyTopic(
    philosophyTopicData: IPhilosophyTopicInput
  ): Promise<IPhilosophyTopic> {
    await this.initializeDbConnection();
    const philosophyTopic = new PhilosophyTopic(philosophyTopicData);
    await philosophyTopic.save();
    return philosophyTopic;
  }

  /**
   * @description Retrieves all philosophy topics in the system
   * @param {boolean} isVisible - If provided, filters by visibility
   * @returns {Promise<IPhilosophyTopic[]>} List of all philosophy topics
   */
  async getPhilosophyTopics(isVisible?: boolean): Promise<IPhilosophyTopic[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await PhilosophyTopic.find({ isVisible: true });
    }
    return await PhilosophyTopic.find();
  }

  /**
   * @description Retrieves a single philosophy topic by its ID
   * @param {Types.ObjectId} philosophyTopicId - The ID of the philosophy topic to retrieve
   * @returns {Promise<IPhilosophyTopic | null>} The philosophy topic found or null if not found
   */
  async getPhilosophyTopicById(
    philosophyTopicId: Types.ObjectId
  ): Promise<IPhilosophyTopic | null> {
    await this.initializeDbConnection();
    const philosophyTopic = await PhilosophyTopic.findById(philosophyTopicId);
    if (!philosophyTopic) throw new Error("Philosophy Topic not found");
    return philosophyTopic;
  }

  /**
   * @description Updates a philosophy topic by its ID
   * @param {Types.ObjectId} philosophyTopicId - The ID of the philosophy topic to update
   * @param {IPhilosophyTopicUpdate} philosophyTopicData - The data to update the philosophy topic
   * @returns {Promise<IPhilosophyTopic | null>} The updated philosophy topic
   */
  async updatePhilosophyTopic(
    philosophyTopicId: Types.ObjectId,
    philosophyTopicData: IPhilosophyTopicUpdate
  ): Promise<IPhilosophyTopic | null> {
    await this.initializeDbConnection();
    const existingPhilosophyTopic = await PhilosophyTopic.findById(
      philosophyTopicId
    );
    if (!existingPhilosophyTopic) {
      throw new Error("Philosophy Topic Not Found");
    }

    const updatedPhilosophyTopic = await PhilosophyTopic.findByIdAndUpdate(
      philosophyTopicId,
      philosophyTopicData,
      { new: true }
    );
    if (!updatedPhilosophyTopic) throw new Error("Philosophy Topic not found");
    return updatedPhilosophyTopic;
  }

  /**
   * @description Deletes a philosophy topic by its ID
   * @param {Types.ObjectId} philosophyTopicId - The ID of the philosophy topic to delete
   * @returns {Promise<IPhilosophyTopic | null>} The deleted philosophy topic
   */
  async deletePhilosophyTopic(
    philosophyTopicId: Types.ObjectId
  ): Promise<IPhilosophyTopic | null> {
    await this.initializeDbConnection();
    const philosophyTopic = await PhilosophyTopic.findById(philosophyTopicId);
    if (!philosophyTopic) throw new Error("Philosophy Topic not found");

    const deletedPhilosophyTopic = await PhilosophyTopic.findByIdAndDelete(
      philosophyTopicId
    );
    return deletedPhilosophyTopic;
  }

  /**
   * @description Deletes multiple philosophy topics by their IDs
   * @param {Types.ObjectId[]} philosophyTopicIds - Array of philosophy topic IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deletePhilosophyTopics(
    philosophyTopicIds: Types.ObjectId[]
  ): Promise<unknown> {
    await this.initializeDbConnection();

    const philosophyTopics = await PhilosophyTopic.find({
      _id: { $in: philosophyTopicIds },
    });
    if (philosophyTopics.length === 0)
      throw new Error("No philosophy topics found");

    const deletedPhilosophyTopics = await PhilosophyTopic.deleteMany({
      _id: { $in: philosophyTopicIds },
    });
    return deletedPhilosophyTopics;
  }
}
