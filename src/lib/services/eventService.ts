import { Event } from "@/lib/models";
import { IEventInput, IEventUpdate, IEvent, IEventService } from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";

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
    const event = new Event(eventData);
    await event.save();
    return event;
  }

  /**
   * @description Retrieves all events in the system
   * @returns {Promise<IEvent[]>} List of all events
   */
  async getEvents(): Promise<IEvent[]> {
    await this.initializeDbConnection();
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
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new Error("Event not found");
    return event;
  }
}
