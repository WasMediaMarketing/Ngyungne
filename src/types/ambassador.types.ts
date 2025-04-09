import { TeamMemberRole } from "./team-member";

export interface Ambassador {
  id?: string;
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
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAmbassadorInput {
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
  isVisible?: boolean;
}

export interface UpdateAmbassadorInput {
  name?: string;
  role?: TeamMemberRole;
  bio?: string;
  image?: string;
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
  isVisible?: boolean;
}

export interface UpdateAmbassadorVisibilityInput {
  isVisible: boolean;
}
