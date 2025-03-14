import { IBookEventInput, IBookEventData, IBookEventupdate } from "@/types";

export interface IBookEventService {
  createBookEvent(bookEventData: IBookEventInput): Promise<IBookEventData>;
  updateBookEvent(
    bookEventId: string,
    bookEventData: IBookEventupdate
  ): Promise<boolean>;
  getBookEvents(bookEventId?: string): Promise<IBookEventData[]>;
  deleteBookEvent(bookEventId: string): Promise<boolean>;
  deleteBookEvents(bookEventIds: string[]): Promise<boolean>;
}
