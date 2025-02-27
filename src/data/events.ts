export interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  teacher: string;
  image: string;
  tags: string[];
  featured: boolean;
  attending: number;
  capacity: number;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Mindfulness Meditation Workshop",
    description:
      "Learn the basics of mindfulness meditation and cultivate inner peace.",
    type: "Workshop",
    date: new Date("2024-04-15"),
    time: "7:00 PM - 8:30 PM",
    location: "Online",
    teacher: "Tenzin Wangyal Rinpoche",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Meditation", "Mindfulness", "Stress Reduction"],
    featured: true,
    attending: 25,
    capacity: 50,
  },
  {
    id: 2,
    title: "Weekend Retreat: Finding Inner Peace",
    description:
      "A weekend retreat to disconnect from the world and reconnect with yourself.",
    type: "Retreat",
    date: new Date("2024-05-03"),
    time: "Friday 6:00 PM - Sunday 4:00 PM",
    location: "Mountain View Retreat Center",
    teacher: "Jetsunma Tenzin Palmo",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Retreat", "Meditation", "Yoga", "Nature"],
    featured: true,
    attending: 40,
    capacity: 40,
  },
  // Add more events here...
];
