import { Event } from "@/lib/models";
import { IEventInput, IEventUpdate, IEvent, IEventService } from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile"; // Import the deleteFile utility

export class EventService implements IEventService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new event in the system
   * @param {IEventInput} eventData - Data to create the event
   * @returns {Promise<IEvent>} The created event
   */
  async createEvent(eventData: IEventInput): Promise<IEvent> {
    await this.initializeDbConnection();
    const event = new Event({...eventData, availableTickets: eventData.capacity});
    await event.save();
    return event;
  }

  /**
   * @description Retrieves all events in the system
   * @returns {Promise<IEvent[]>} List of all events
   */
  async getEvents(isVisible?: boolean): Promise<IEvent[]> {
    await this.initializeDbConnection();
    if(isVisible){
      return await Event.find({isVisible: true});
    }
    return await Event.find();
  }

  /**
   * @description Retrieves a single event by its ID
   * @param {string} eventId - The ID of the event to retrieve
   * @returns {Promise<IEvent | null>} The event found or null if not found
   */
  async getEventById(eventId: Types.ObjectId): Promise<IEvent | null> {
    await this.initializeDbConnection();
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    return event;
  }

  /**
   * @description Updates an event by its ID
   * @param {string} eventId - The ID of the event to update
   * @param {IEventUpdate} eventData - The data to update the event
   * @returns {Promise<IEvent | null>} The updated event
   */
  async updateEvent(
    eventId: Types.ObjectId,
    eventData: IEventUpdate
  ): Promise<IEvent | null> {
    await this.initializeDbConnection();
    const existingEvent = await Event.findById(eventId);
    if(!existingEvent){
      throw new Error("Event Not Found");
    }
    if (
      eventData.image &&
      eventData.image !== existingEvent.image &&
      existingEvent.image
    ) {
      deleteFile(existingEvent.image);
    }
    if (
      eventData.teacher?.image &&
      eventData.teacher.image !== existingEvent.teacher.image &&
      existingEvent.teacher.image
    ) {
      deleteFile(existingEvent.teacher.image);
    }
    const event = await Event.findByIdAndUpdate(eventId, eventData, {
      new: true,
    });
    if (!event) throw new Error("Event not found");
    return event;
  }

  /**
   * @description Deletes an event by its ID
   * @param {string} eventId - The ID of the event to delete
   * @returns {Promise<IEvent | null>} The deleted event
   */
  async deleteEvent(eventId: Types.ObjectId): Promise<IEvent | null> {
    await this.initializeDbConnection();
    
    // Find the event to get its image path (if exists)
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    // If there's an image, delete it
    if (event.image) {
      deleteFile(event.image); // Delete the image file from the file system
    }

    // Now delete the event from the database
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return deletedEvent;
  }

  /**
   * @description Deletes multiple events by their IDs
   * @param {Types.ObjectId[]} eventIds - Array of event IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteEvents(eventIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all events to get their image paths (if exists)
    const events = await Event.find({ _id: { $in: eventIds } });
    if (events.length === 0) throw new Error("No events found");

    // Delete images for all events
    events.forEach((event) => {
      if (event.image) {
        deleteFile(event.image); // Delete each event's image from the file system
      }
    });

    // Delete the events from the database
    const deletedEvents = await Event.deleteMany({ _id: { $in: eventIds } });
    return deletedEvents;
  }
}
