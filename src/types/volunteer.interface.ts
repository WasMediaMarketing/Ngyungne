import { IVolunteerInput, IVolunteerData } from "@/types";

export interface IVolunteerService {
  createVolunteer(volunteerData: IVolunteerInput): Promise<IVolunteerData>;
  getVolunteers(volunteerId?: string): Promise<IVolunteerData[]>;
  deleteVolunteer(volunteerId: string): Promise<boolean>;
  deleteVolunteers(volunteerIds: string[]): Promise<boolean>;
}
