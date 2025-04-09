export interface TeamMember {
  id: number;
  name: string;
  role: TeamMemberRole;
  bio: string;
  image: string;
  location?: string;
  quote?: string;
  achievements?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
    email?: string;
  };
}

export type TeamMemberRole =
  | "Founder"
  | "Co-Founder"
  | "Executive Director"
  | "Ambassador"
  | "Program Coordinator"
  | "Community Liaison"
  | "Volunteer";
