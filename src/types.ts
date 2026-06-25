export type ActiveTab = 'HOME' | 'SEARCH' | 'BLIND_DATE' | 'RIDES' | 'PROFILE';

export type OnboardingStep = 'SPLASH' | 'IDENTITY_VERIFICATION' | 'PERSONALITY_QUESTION' | 'CALCULATING' | 'COMPLETED';

export type VerifyMethod = 'SHEERID' | 'COLLEGE_ID';

export interface FeedItem {
  id: string;
  type: 'post' | 'poll';
  authorName: string;
  authorLabel?: string;
  iconName: string;
  timeAgoText: string;
  locationText: string;
  content: string;
  interestedCount?: number;
  isInterestedByMe?: boolean;
  pollOptions?: {
    id: string;
    text: string;
    votes: number;
  }[];
  userVotedOptionId?: string;
}

export interface Ride {
  id: string;
  from: string;
  to: string;
  pricePerPerson: number;
  timeText: string;
  provider: string; // e.g. 'Uber XL', 'Ola Prime'
  seatsAvailable: number;
  seatsTotal: number;
  status: 'Leaving Soon' | 'Filling Fast' | 'Available';
  timeAgoText: string;
  isAccepted?: boolean;
  isRejected?: boolean;
}

export interface DateProfile {
  id: string;
  age: number;
  batchAndDegree: string;
  compatibilityScore: number;
  tags: string[];
  sharedInterests: string;
  locationMatch: string;
  socialResonance: number;
  intellectualDepth: number;
  spontaneity: number;
  vibeText: string;
  createdAt?: string;
  mutualInterestsCount?: number;
}

export interface AnonymousConfession {
  id: string;
  content: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
}

export interface StudyGroup {
  id: string;
  subject: string;
  topic: string;
  membersCount: number;
  maxMembers: number;
  timeText: string;
  location: string;
  isJoined?: boolean;
}

export interface Tournament {
  id: string;
  gameTitle: string;
  prizePool: string;
  teamsRegistered: number;
  maxTeams: number;
  dateText: string;
  isRegistered?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  interestedCount: number;
  universityId: string;
}
