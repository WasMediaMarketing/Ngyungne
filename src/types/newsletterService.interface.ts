import { Types } from "mongoose";
import { INewsletter } from "./newsletter.types";
export interface INewsletterService {
  createSubscription(subscriptionData: INewsletter): Promise<INewsletter>;
  getSubscriptions(): Promise<INewsletter[]>;
  getSubscriptionById(subscriberId: Types.ObjectId): Promise<INewsletter>;
  getSubscriptionByEmail(email: string): Promise<INewsletter | null>;
  deleteSubscription(subscriberId: Types.ObjectId): Promise<INewsletter>;
  deleteSubscriptions(subscriberIds: Types.ObjectId[]): Promise<boolean>;
}
