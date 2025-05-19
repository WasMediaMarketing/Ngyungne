import type { IPhilosophyTopicService } from "@/types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";

export class PhilosophyTopicController {
  private philosophyTopicService: IPhilosophyTopicService;

  constructor(philosophyTopicService: IPhilosophyTopicService) {
    this.philosophyTopicService = philosophyTopicService;
  }

  /**
   * @summary Create a new philosophy topic
   * @param {any} philosophyTopicData - The philosophy topic data
   * @returns {NextResponse} The response with the created philosophy topic
   */
  async createPhilosophyTopic(philosophyTopicData: any): Promise<NextResponse> {
    try {
      const philosophyTopic =
        await this.philosophyTopicService.createPhilosophyTopic(
          philosophyTopicData
        );
      return handleResponse(philosophyTopic, httpMessages.CREATED());
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all philosophy topics
   * @returns {NextResponse} The response with the list of philosophy topics
   */
  async getPhilosophyTopics(): Promise<NextResponse> {
    try {
      const philosophyTopics =
        await this.philosophyTopicService.getPhilosophyTopics();
      return handleResponse(philosophyTopics);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all visible philosophy topics
   * @returns {NextResponse} The response with the list of visible philosophy topics
   */
  async getVisiblePhilosophyTopics(): Promise<NextResponse> {
    try {
      const philosophyTopics =
        await this.philosophyTopicService.getPhilosophyTopics(true);
      return handleResponse(philosophyTopics);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get a philosophy topic by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the philosophy topic details
   */
  async getPhilosophyTopicById(req: NextRequest): Promise<NextResponse> {
    try {
      const topicId = req.nextUrl.pathname.split("/").pop();
      if (!topicId || !Types.ObjectId.isValid(topicId)) {
        return handleError(
          httpMessages.BAD_REQUEST(
            "Philosophy Topic ID is either missing or invalid"
          )
        );
      }

      const philosophyTopic =
        await this.philosophyTopicService.getPhilosophyTopicById(
          new Types.ObjectId(topicId)
        );
      return handleResponse(philosophyTopic);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Update a philosophy topic by ID
   * @param {string} topicId - The ID of the philosophy topic to update
   * @param {any} philosophyTopicData - The philosophy topic data to update
   * @returns {NextResponse} The response with the updated philosophy topic
   */
  async updatePhilosophyTopic(
    topicId: string,
    philosophyTopicData: any
  ): Promise<NextResponse> {
    try {
      if (!topicId || !Types.ObjectId.isValid(topicId)) {
        return handleError(
          httpMessages.BAD_REQUEST(
            "Philosophy Topic ID is either missing or invalid"
          )
        );
      }

      const updatedPhilosophyTopic =
        await this.philosophyTopicService.updatePhilosophyTopic(
          new Types.ObjectId(topicId),
          philosophyTopicData
        );
      return handleResponse(updatedPhilosophyTopic);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete a philosophy topic by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the philosophy topic was deleted successfully
   */
  async deletePhilosophyTopic(req: NextRequest): Promise<NextResponse> {
    try {
      const topicId = req.nextUrl.pathname.split("/").pop();
      if (!topicId || !Types.ObjectId.isValid(topicId)) {
        return handleError(
          httpMessages.BAD_REQUEST(
            "Philosophy Topic ID is either missing or invalid"
          )
        );
      }

      const deletedPhilosophyTopic =
        await this.philosophyTopicService.deletePhilosophyTopic(
          new Types.ObjectId(topicId)
        );
      return handleResponse(deletedPhilosophyTopic);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete multiple philosophy topics by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deletePhilosophyTopics(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const philosophyTopicIds = url.searchParams.get("philosophyTopicIds");
      if (!philosophyTopicIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Philosophy Topic IDs are required")
        );
      }

      const philosophyTopicIdArray = philosophyTopicIds
        .split(",")
        .map((id) => id.trim());

      for (const id of philosophyTopicIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Philosophy Topic ID: ${id}`)
          );
        }
      }

      const objectIds = philosophyTopicIdArray.map(
        (id) => new Types.ObjectId(id)
      );

      const isDeleted =
        await this.philosophyTopicService.deletePhilosophyTopics(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deletePhilosophyTopicsController error:", error);
      return handleError();
    }
  }
}
