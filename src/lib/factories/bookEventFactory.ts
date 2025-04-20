import { BookEventService } from "@/lib/services";
import { BookEventController } from "@/lib/controllers";

export function createBookEventController() {
  const bookEventService = new BookEventService();
  return new BookEventController(bookEventService);
}
