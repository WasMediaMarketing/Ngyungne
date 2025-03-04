import { Types } from "mongoose";
import { IEventUpdate, IEvent, IEventInput } from "@/types";

export interface IEventService {
  createEvent(eventData: IEventInput): Promise<IEvent>;
  getEvent(): Promise<IEvent[]>;
  getEventById(eventId: Types.ObjectId): Promise<IEvent | null>;
  updateEvent(
    eventId: Types.ObjectId,
    eventData: IEventUpdate
  ): Promise<IEvent | null>;
  deleteEvent(eventId: Types.ObjectId): Promise<IEvent | null>;
}
