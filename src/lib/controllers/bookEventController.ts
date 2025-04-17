import { NextRequest, NextResponse } from "next/server";
import { IBookEventService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";

export class BookEventController {
  private bookEventService: IBookEventService;

  constructor(bookEventService: IBookEventService) {
    this.bookEventService = bookEventService;
  }

  async createBookEvent(req: NextRequest): Promise<NextResponse> {
    try {
      const bookEventData = await req.json();
      console.log("body in controller", bookEventData);
      const bookEvent = await this.bookEventService.createBookEvent(
        bookEventData
      );
      return handleResponse(bookEvent, httpMessages.CREATED());
    } catch (error) {
      console.error("createBookEventController error:", error);
      return handleError();
    }
  }

  async getBookEvents(): Promise<NextResponse> {
    try {
      const bookEvents = await this.bookEventService.getBookEvents();
      return handleResponse(bookEvents);
    } catch (error) {
      console.error("getBookEventsController error:", error);
      return handleError();
    }
  }

  async getBookEventById(req: NextRequest): Promise<NextResponse> {
    try {
      const bookEventId = req.nextUrl.pathname.split("/").pop();

      if (!bookEventId) {
        return handleError(
          httpMessages.BAD_REQUEST("BookEvent ID is required")
        );
      }

      const bookEvent = await this.bookEventService.getBookEvents(bookEventId);
      return handleResponse(bookEvent);
    } catch (error) {
      console.error("getBookEventByIdController error:", error);
      return handleError();
    }
  }

  async updateBookEvent(req: NextRequest): Promise<NextResponse> {
    try {
      const bookEventId = req.nextUrl.pathname.split("/").pop();

      if (!bookEventId) {
        return handleError(
          httpMessages.BAD_REQUEST("BookEvent ID is required")
        );
      }

      const bookEventData = await req.json();
      const updatedBookEvent = await this.bookEventService.updateBookEvent(
        bookEventId,
        bookEventData
      );
      return handleResponse(updatedBookEvent);
    } catch (error) {
      console.error("updateBookEventController error:", error);
      return handleError();
    }
  }

  // Delete a single bookEvent by ID
  async deleteBookEvent(req: NextRequest): Promise<NextResponse> {
    try {
      const bookEventId = req.nextUrl.pathname.split("/").pop(); // Extract the bookEventId from the URL path

      if (!bookEventId) {
        return handleError(
          httpMessages.BAD_REQUEST("BookEvent ID is required")
        );
      }

      const isDeleted = await this.bookEventService.deleteBookEvent(
        bookEventId
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteBookEventController error:", error);
      return handleError();
    }
  }

  // Delete multiple bookEvents by their IDs
  async deleteBookEvents(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract bookEvent IDs from query parameters
      const url = req.nextUrl;
      const bookEventIds = url.searchParams.get("bookEventIds");
      if (!bookEventIds) {
        return handleError(
          httpMessages.BAD_REQUEST("BookEvent IDs are required")
        );
      }

      // Parse bookEvent IDs into an array
      const bookEventIdArray = bookEventIds.split(",").map((id) => id.trim());

      for (const id of bookEventIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Event ID: ${id}`)
          );
        }
      }
      const isDeleted = await this.bookEventService.deleteBookEvents(
        bookEventIdArray
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteBookEventsController error:", error);
      return handleError();
    }
  }
}
