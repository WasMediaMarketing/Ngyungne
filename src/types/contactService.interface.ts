import { IContactInput, IContactData } from "@/types";

export interface IContactService {
  createContact(contactData: IContactInput): Promise<IContactData>;
  getContacts(contactId?: string): Promise<IContactData[]>;
  deleteContact(contactId: string): Promise<boolean>;
  deleteContacts(contactIds: string[]): Promise<boolean>;
}
