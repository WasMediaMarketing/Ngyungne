import {
  IBookEventService,
  IBookEventInput,
  IBookEventData,
  IBookEventupdate,
} from "@/types";
import { BookEvent, Event } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";

export class BookEventService implements IBookEventService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  async createBookEvent(
    bookEventData: IBookEventInput
  ): Promise<IBookEventData> {
    await this.initializeDbConnection();

    const event = await Event.findById(bookEventData.eventId);

    if (!event) {
      console.error("Event not found!");
      throw new Error("Event not found");
    }

    if (
      event.availableTickets &&
      bookEventData.TicketNumber > event.availableTickets
    ) {
      console.error(
        `Booking exceeds event capacity! Capacity: ${event.capacity}, Available: ${event.availableTickets}`
      );
      throw new Error(
        `Booking exceeds the event's capacity of ${event.capacity}. Only ${event.availableTickets} tickets are available.`
      );
    }

    const userService = new UserService();
    const user = await userService.createUser({
      name: bookEventData.name,
      email: bookEventData.email,
      phoneNumber: bookEventData.phoneNumber,
      page: bookEventData.page,
      pageTitle: bookEventData.pageTitle,
    });

    const bookEvent = new BookEvent({
      userId: user.id,
      eventId: bookEventData.eventId,
      TicketNumber: bookEventData.TicketNumber,
      dietaryRequirements: bookEventData.dietaryRequirements,
      specialAccomodation: bookEventData.specialAccomodation,
    });

    await bookEvent.save();

    event.attending =
      (event.attending ? event.attending : 0) + bookEventData.TicketNumber;
    event.availableTickets -= bookEventData.TicketNumber;

    await event.save();

    return bookEvent;
  }

  async getBookEvents(eventId?: string): Promise<IBookEventData[]> {
    await this.initializeDbConnection();

    if (eventId) {
      return await BookEvent.find({ eventId })
        .populate("userId")
        .populate("eventId");
    }

    return await BookEvent.find().populate("userId").populate("eventId");
  }

  async deleteBookEvent(bookEventId: string): Promise<boolean> {
    await this.initializeDbConnection();

    const bookEvent = await BookEvent.findById(bookEventId);
    if (!bookEvent) return false;
    const event = await Event.findById(bookEvent.eventId);
    if (event) {
      event.attending! -= bookEvent.TicketNumber;
      await event.save();
    }

    const result = await BookEvent.findByIdAndDelete(bookEventId);
    return !!result;
  }

  async deleteBookEvents(bookEventIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();
    const bookEvents = await BookEvent.find({ _id: { $in: bookEventIds } });
    for (const bookEvent of bookEvents) {
      const event = await Event.findById(bookEvent.eventId);
      if (event) {
        event.attending! -= bookEvent.TicketNumber;
        await event.save();
      }
    }

    const result = await BookEvent.deleteMany({ _id: { $in: bookEventIds } });
    return result.deletedCount > 0;
  }

  async updateBookEvent(
    bookEventId: string,
    bookEventData: IBookEventupdate
  ): Promise<boolean> {
    await this.initializeDbConnection();
    const existingBookEvent = await BookEvent.findById(bookEventId);
    if (!existingBookEvent) {
      throw new Error("Booking event not found");
    }
    const event = await Event.findById(existingBookEvent.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (bookEventData.TicketNumber) {
      const ticketDifference =
        bookEventData.TicketNumber - existingBookEvent.TicketNumber;
      if (ticketDifference <= 0) {
        //condition for reducing ticket number
        await BookEvent.findByIdAndUpdate(bookEventId, bookEventData, {
          new: true,
        });
        event.attending = (event.attending || 0) + Math.abs(ticketDifference);
        event.availableTickets =
          event.availableTickets - Math.abs(ticketDifference);
        await event.save();
      } else if (ticketDifference > 0) {
        //condition for increasing the ticket number
        if (event.availableTickets < ticketDifference) {
          throw new Error(
            `Booking exceeds the event's capacity of ${event.capacity}. Only ${event.availableTickets} tickets are available.`
          );
        }
        await BookEvent.findByIdAndUpdate(bookEventId, bookEventData, {
          new: true,
        });
        event.attending = (event.attending || 0) + ticketDifference;
        event.availableTickets = event.availableTickets - ticketDifference;
        await event.save();
      }
    } else {
      await BookEvent.findByIdAndUpdate(bookEventId, bookEventData, {
        new: true,
      });
    }
    return true;
  }
}
