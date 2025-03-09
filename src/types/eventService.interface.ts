import { Types } from "mongoose";
import { IEventUpdate, IEvent, IEventInput } from "@/types";

export interface IEventService {
  createEvent(eventData: IEventInput): Promise<IEvent>;
  getEvents(): Promise<IEvent[]>;
  getEventById(eventId: Types.ObjectId): Promise<IEvent | null>;
  updateEvent(
    eventId: Types.ObjectId,
    eventData: IEventUpdate
  ): Promise<IEvent | null>;
  deleteEvent(eventId: Types.ObjectId): Promise<IEvent | null>;
  deleteEvents(eventIds: Types.ObjectId[]):Promise<unknown>;
}
