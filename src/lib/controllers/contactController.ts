import { NextRequest, NextResponse } from "next/server";
import { IContactService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";

export class ContactController {
  private contactService: IContactService;

  constructor(contactService: IContactService) {
    this.contactService = contactService;
  }

  // Create a new contact
  async createContact(req: NextRequest): Promise<NextResponse> {
    try {
      const contactData = await req.json();
      const contact = await this.contactService.createContact(contactData);
      return handleResponse(contact, httpMessages.CREATED());
    } catch (error) {
      console.error("createContactController error:", error);
      return handleError();
    }
  }

  // Get all contacts or a specific contact by ID
  async getContacts(): Promise<NextResponse> {
    try {
      const contacts = await this.contactService.getContacts();

      return handleResponse(contacts);
    } catch (error) {
      console.error("getContactsController error:", error);
      return handleError();
    }
  }

  // Delete a single contact by ID
  async deleteContact(req: NextRequest): Promise<NextResponse> {
    try {
      const contactId = req.nextUrl.pathname.split("/").pop(); // Extract the contactId from the URL path

      if (!contactId) {
        return handleError(httpMessages.BAD_REQUEST("Contact ID is required"));
      }

      const isDeleted = await this.contactService.deleteContact(contactId);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteContactController error:", error);
      return handleError();
    }
  }

  // Delete multiple contacts by their IDs
  async deleteContacts(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract contact IDs from query parameters
      const url = req.nextUrl;
      const contactIds = url.searchParams.get("contactIds");
      if (!contactIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Contact IDs are required")
        );
      }

      // Parse contact IDs into an array
      const contactIdArray = contactIds.split(",").map((id) => id.trim());

      for (const id of contactIdArray) {
              if (!Types.ObjectId.isValid(id)) {
                return handleError(
                  httpMessages.BAD_REQUEST(`Invalid Event ID: ${id}`)
                );
              }
            }
      const isDeleted = await this.contactService.deleteContacts(
        contactIdArray
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteContactsController error:", error);
      return handleError();
    }
  }
}
