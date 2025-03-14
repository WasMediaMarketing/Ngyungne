import { IEventService } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { IEvent } from "@/types";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class EventController {
  private eventService: IEventService;
  constructor(eventService: IEventService) {
    this.eventService = eventService;
  }

  /**
   * @summary Create a new event
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created event
   */
  async createEvent(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const eventData = await req.json();
      const event = await this.eventService.createEvent(eventData);
      return handleResponse(event, httpMessages.CREATED());
    } catch (error) {
      console.log("createEventController error", error);
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all events
   * @description Retrieves all events from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of events
   */
  async getEvents(): Promise<NextResponse> {
    try {
      const events = await this.eventService.getEvents();
      return handleResponse(events);
    } catch (error) {
      console.log("getEventsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all published events
   * @description Retrieves all events from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of events
   */
  async getPublishedEvents(): Promise<NextResponse> {
    try {
      const events = await this.eventService.getEvents(true);
      return handleResponse(events);
    } catch (error) {
      console.log("getEventsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get an event by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the event details
   */
  async getEventById(req: NextRequest): Promise<NextResponse> {
    try {
      const eventId = req.nextUrl.pathname.split("/").pop();
      if (!eventId || !Types.ObjectId.isValid(eventId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Event ID is either missing or invalid")
        );
      }

      // Fetch the event using the eventId
      const event = await this.eventService.getEventById(
        new Types.ObjectId(eventId)
      );
      return handleResponse(event);
    } catch (error) {
      console.log("getEventsController error", error);
      return handleError();
    }
  }
  /**
   * @summary Get all events directly in props
   * @description Retrieves all events from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of events
   */
  async getEventsForProps(): Promise<IEvent[] | unknown> {
    try {
      const events = await this.eventService.getEvents();
      return { data: events };
    } catch (error) {
      console.log("getEventsController error", error);
      return { error: error as Error };
    }
  }

  /**
   * @summary Get an event by ID directly for props
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the event details
   */
  async getEventByIdForProps(eventId: string): Promise<IEvent | unknown> {
    try {
      if (!eventId || !Types.ObjectId.isValid(eventId)) {
        throw new Error("Event ID is either missing or invalid");
      }

      // Fetch the event using the eventId
      const event = await this.eventService.getEventById(
        new Types.ObjectId(eventId)
      );
      return { data: event };
    } catch (error) {
      console.log("getEventsController error", error);
      return { error: error };
    }
  }

  /**
   * @summary Update an event by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated event
   */
  async updateEvent(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const eventId = req.nextUrl.pathname.split("/").pop();
      if (!eventId || !Types.ObjectId.isValid(eventId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Event ID is either missing or invalid")
        );
      }

      const eventData = await req.json();
      const updatedEvent = await this.eventService.updateEvent(
        new Types.ObjectId(eventId),
        eventData
      );
      return handleResponse(updatedEvent);
    } catch (error) {
      console.log("updateEventController error", error);
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete an event by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the event was deleted successfully
   */
  async deleteEvent(req: NextRequest): Promise<NextResponse> {
    try {
      const eventId = req.nextUrl.pathname.split("/").pop();
      if (!eventId || !Types.ObjectId.isValid(eventId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Event ID is either missing or invalid")
        );
      }

      const deletedEvent = await this.eventService.deleteEvent(
        new Types.ObjectId(eventId)
      );
      return handleResponse(deletedEvent);
    } catch (error) {
      console.log("deleteEventController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete multiple events by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteEvents(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const eventIds = url.searchParams.get("eventIds");
      if (!eventIds) {
        return handleError(httpMessages.BAD_REQUEST("Event IDs are required"));
      }

      const eventIdArray = eventIds.split(",").map((id) => id.trim());

      for (const id of eventIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Event ID: ${id}`)
          );
        }
      }

      const objectIds = eventIdArray.map((id) => new Types.ObjectId(id));

      console.log("Event IDs (ObjectId format):", objectIds);
      const isDeleted = await this.eventService.deleteEvents(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteEventsController error:", error);
      return handleError();
    }
  }
}
