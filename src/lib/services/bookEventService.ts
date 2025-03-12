import { IBookEventService, IBookEventInput, IBookEventData } from "@/types";
import { BookEvent, Event } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";

export class BookEventService implements IBookEventService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  private async validateEventAndTicket(eventId: string, ticketNumber: number) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.capacity && ticketNumber + (event.attending?event.attending:0) > event.capacity) {
      throw new Error(
        `Booking exceeds the event's capacity of ${event.capacity}. Only ${
          event.capacity - (event.attending ? event.attending : 0)
        } tickets are available.`
      );
    }

    return event;
  }

  async createBookEvent(
    bookEventData: IBookEventInput
  ): Promise<IBookEventData> {
    await this.initializeDbConnection();

    const userService = new UserService();
    const user = await userService.createUser({
      name: bookEventData.name,
      email: bookEventData.email,
      phoneNumber: bookEventData.phoneNumber,
      role: "event-participant",
      page: bookEventData.page,
      pageTitle: bookEventData.pageTitle,
    });

    const event = await this.validateEventAndTicket(
      bookEventData.eventId.toString(),
      bookEventData.TicketNumber
    );

    const bookEvent = new BookEvent({
      userId: user.id,
      eventId: bookEventData.eventId,
      TicketNumber: bookEventData.TicketNumber,
      dietaryRequirements: bookEventData.dietaryRequirements,
      specialAccomodation: bookEventData.specialAccomodation,
    });

    await bookEvent.save();

    event.attending = (event.attending?event.attending:0) + bookEventData.TicketNumber;
    await event.save();

    return bookEvent;
  }

  async getBookEvents(eventId?: string): Promise<IBookEventData[]> {
    await this.initializeDbConnection();

    if (eventId) {
      return await BookEvent.find({ eventId }).populate("userId");
    }

    return await BookEvent.find().populate("userId");
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
}
