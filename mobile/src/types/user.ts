export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  email?: string;
  location: string;
  region: string;
  rating: number;
  totalReviews: number;
  totalSwaps: number;
  memberSince: string;
  bio: string;
  verified: boolean;
  responseRate: number;
  responseTime: string;
  avatarUrl?: string;
}
