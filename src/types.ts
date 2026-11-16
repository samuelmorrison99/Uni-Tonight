export interface CrewPlan {
  id: string;
  title: string;
  category: 'Dancing' | 'Party' | 'Dinner & Drinks' | 'Bar Hopping' | 'Club';
  host: string;
  hostId?: string;
  location: string;
  time: string;
  attendeesCount: number;
  joined: boolean;
  attendeeIds?: string[];
  requestIds?: string[];
  city?: string;
  description?: string;
  image?: string;
  maxPeople?: number;
  genderPreference?: 'Any' | 'Girls Only' | 'Guys Only' | 'Mixed';
  vibes?: string[];
  matchingType?: 'Auto-join' | 'Request to join';
  eventTimestamp?: number;
  createdAt?: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  createdAt: number;
}

export interface CrewChatMessage {
  id: string;
  crewId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  vibes: string[];
  photos: string[];
  deletedAt?: number;
  directMessages?: DirectMessage[];
  crewMessages?: CrewChatMessage[];
}

export interface Venue {
  id: string;
  name: string;
  area: string;
  image: string;
  type: string;
  rating: number;
  closingTime: string;
  isOpen: boolean;
  coordinates: { top: string; left: string };
  vibes?: string[];
}
