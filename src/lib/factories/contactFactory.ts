import { ContactService } from "@/lib/services";
import { ContactController } from "@/lib/controllers";

export function createContactController() {
  const contactService = new ContactService();
  return new ContactController(contactService);
}
