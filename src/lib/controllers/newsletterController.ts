import type { INewsletterService } from "@/types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { Types } from "mongoose";

/**
 * Controller for handling Newsletter-related HTTP requests
 */
export class NewsletterController {
  private newsletterService: INewsletterService;

  /**
   * Creates a new Newsletter controller
   * @param {INewsletterService} newsletterService - The Newsletter service to use
   */
  constructor(newsletterService: INewsletterService) {
    this.newsletterService = newsletterService;
  }

  /**
   * Creates a new newsletter subscription
   * @param {any} subscriptionData - The subscription data
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async createSubscription(subscriptionData: any): Promise<NextResponse> {
    try {
      // Check if email already exists
      const existingSubscription =
        await this.newsletterService.getSubscriptionByEmail(
          subscriptionData.email
        );
      if (existingSubscription) {
        return handleError(
          httpMessages.CONFLICT("Email is already subscribed to the newsletter")
        );
      }

      const subscription = await this.newsletterService.createSubscription(
        subscriptionData
      );
      return handleResponse(subscription, httpMessages.CREATED());
    } catch (error) {
      console.error("createSubscriptionController error:", error);
      return handleError();
    }
  }

  /**
   * Gets all newsletter subscriptions
   * @returns {Promise<NextResponse>} The HTTP response with all subscriptions
   */
  async getSubscriptions(): Promise<NextResponse> {
    try {
      const subscriptions = await this.newsletterService.getSubscriptions();
      return handleResponse(subscriptions);
    } catch (error) {
      console.error("getSubscriptionsController error:", error);
      return handleError();
    }
  }

  /**
   * Gets a newsletter subscription by ID
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response with the subscription
   */
  async getSubscriptionById(req: NextRequest): Promise<NextResponse> {
    try {
      const subscriberId = req.nextUrl.pathname.split("/").pop();
      if (!subscriberId || !Types.ObjectId.isValid(subscriberId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Subscriber ID is either missing or invalid")
        );
      }

      const subscription = await this.newsletterService.getSubscriptionById(
        new Types.ObjectId(subscriberId)
      );
      if (!subscription) {
        return handleError(httpMessages.NOT_FOUND("Subscriber not found"));
      }

      return handleResponse(subscription);
    } catch (error) {
      console.error("getSubscriptionByIdController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes a newsletter subscription by ID
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteSubscription(req: NextRequest): Promise<NextResponse> {
    try {
      const subscriberId = req.nextUrl.pathname.split("/").pop();
      if (!subscriberId || !Types.ObjectId.isValid(subscriberId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Subscriber ID is either missing or invalid")
        );
      }

      try {
        const deletedSubscription =
          await this.newsletterService.deleteSubscription(
            new Types.ObjectId(subscriberId)
          );
        return handleResponse(deletedSubscription);
      } catch (error: any) {
        if (error.message === "Subscriber not found") {
          return handleError(httpMessages.NOT_FOUND("Subscriber not found"));
        }
        throw error;
      }
    } catch (error) {
      console.error("deleteSubscriptionController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes multiple newsletter subscriptions by their IDs
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteSubscriptions(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const subscriberIds = url.searchParams.get("subscriberIds");
      if (!subscriberIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Subscriber IDs are required")
        );
      }

      const subscriberIdArray = subscriberIds.split(",").map((id) => id.trim());

      for (const id of subscriberIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Subscriber ID: ${id}`)
          );
        }
      }

      const objectIds = subscriberIdArray.map((id) => new Types.ObjectId(id));

      console.log("Subscriber IDs to delete:", objectIds);
      const result = await this.newsletterService.deleteSubscriptions(
        objectIds
      );

      if (!result) {
        return handleError(
          httpMessages.NOT_FOUND("No subscribers found with the provided IDs")
        );
      }

      return handleResponse({
        success: true,
        message: "Subscribers deleted successfully",
      });
    } catch (error) {
      console.error("deleteSubscriptionsController error:", error);
      return handleError();
    }
  }
}
