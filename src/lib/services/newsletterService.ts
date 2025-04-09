import type { INewsletterService, INewsletter } from "@/types";
import type { Types } from "mongoose";
import { Newsletter } from "../models/newsletter.model";
import { connectToDatabase } from "../utils/mongodb";

/**
 * Service for handling Newsletter-related database operations
 */
export class NewsletterService implements INewsletterService {
  constructor() {
    // Ensure database connection is established
    connectToDatabase();
  }

  /**
   * Creates a new newsletter subscription
   * @param {INewsletter} subscriptionData - The subscription data
   * @returns {Promise<INewsletter>} The created subscription
   */
  async createSubscription(
    subscriptionData: INewsletter
  ): Promise<INewsletter> {
    try {
      const subscription = new Newsletter(subscriptionData);
      await subscription.save();
      return subscription;
    } catch (error) {
      console.error("createSubscription service error:", error);
      throw error;
    }
  }

  /**
   * Gets all newsletter subscriptions
   * @returns {Promise<INewsletter[]>} The list of subscriptions
   */
  async getSubscriptions(): Promise<INewsletter[]> {
    try {
      const subscriptions = await Newsletter.find().sort({ createdAt: -1 });
      return subscriptions;
    } catch (error) {
      console.error("getSubscriptions service error:", error);
      throw error;
    }
  }

  /**
   * Gets a newsletter subscription by ID
   * @param {Types.ObjectId} subscriberId - The subscriber ID
   * @returns {Promise<INewsletter>} The subscription details
   */
  async getSubscriptionById(
    subscriberId: Types.ObjectId
  ): Promise<INewsletter> {
    try {
      const subscription = await Newsletter.findById(subscriberId);
      if (!subscription) {
        throw new Error("Subscriber not found");
      }
      return subscription;
    } catch (error) {
      console.error("getSubscriptionById service error:", error);
      throw error;
    }
  }

  /**
   * Gets a newsletter subscription by email
   * @param {string} email - The email address
   * @returns {Promise<INewsletter | null>} The subscription details or null if not found
   */
  async getSubscriptionByEmail(email: string): Promise<INewsletter | null> {
    try {
      const subscription = await Newsletter.findOne({
        email: email.toLowerCase(),
      });
      return subscription;
    } catch (error) {
      console.error("getSubscriptionByEmail service error:", error);
      throw error;
    }
  }

  /**
   * Deletes a newsletter subscription by ID
   * @param {Types.ObjectId} subscriberId - The subscriber ID
   * @returns {Promise<INewsletter>} The deleted subscription
   */
  async deleteSubscription(subscriberId: Types.ObjectId): Promise<INewsletter> {
    try {
      const subscription = await Newsletter.findByIdAndDelete(subscriberId);
      if (!subscription) {
        throw new Error("Subscriber not found");
      }
      return subscription;
    } catch (error) {
      console.error("deleteSubscription service error:", error);
      throw error;
    }
  }

  /**
   * Deletes multiple newsletter subscriptions by their IDs
   * @param {Types.ObjectId[]} subscriberIds - The subscriber IDs
   * @returns {Promise<boolean>} Whether the subscriptions were deleted successfully
   */
  async deleteSubscriptions(subscriberIds: Types.ObjectId[]): Promise<boolean> {
    try {
      const result = await Newsletter.deleteMany({
        _id: { $in: subscriberIds },
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteSubscriptions service error:", error);
      throw error;
    }
  }
}
