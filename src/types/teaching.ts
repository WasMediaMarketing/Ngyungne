export interface TeachingEvent {
  id: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}
export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
  teachings: {
    title: string;
    date: string;
    type: string;
  }[];
}
