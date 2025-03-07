import { IContactService, IContactInput, IContactData } from "@/types";
import { Contact } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";
export class ContactService implements IContactService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  async createContact(contactData: IContactInput): Promise<IContactData> {
    await this.initializeDbConnection();

    const userService = new UserService();
    const user = await userService.createUser({
      name: contactData.name,
      email: contactData.email,
      phoneNumber: contactData.phoneNumber,
      role: "donator",
      page: contactData.page,
      pageTitle: contactData.pageTitle,
    });

    // Create the contact with the user's ID
    const contact = new Contact({
      userId: user.id,
      subject: contactData.subject,
      message: contactData.message,
    });

    await contact.save();
    return contact;
  }

  async getContacts(contactId?: string): Promise<IContactData[]> {
    await this.initializeDbConnection();

    if (contactId) {
      const contact = await Contact.findById(contactId).populate("userId");
      return contact ? [contact] : [];
    }

    return await Contact.find().populate("userId");
  }

  async deleteContact(contactId: string): Promise<boolean> {
    await this.initializeDbConnection();
    const result = await Contact.findByIdAndDelete(contactId);
    return !!result;
  }

  async deleteContacts(contactIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();
    const result = await Contact.deleteMany({ _id: { $in: contactIds } });
    return result.deletedCount > 0;
  }
}
