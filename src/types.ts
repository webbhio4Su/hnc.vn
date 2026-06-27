export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  password?: string;
  className: string;
  avatar: string;
  background?: string;
  gender: 'male' | 'female' | 'other';
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'user';
  isAdmin?: boolean;
  points?: number;
  hncoi?: number;
  childEmails?: string[]; 
  managedClasses?: string[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  className: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface Competition {
  id: string;
  title: string;
  participants: number;
  timeLeft: string;
  reward: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: any;
  senderId: string;
  senderName: string;
  isRead?: boolean;
  type: 'announcement' | 'system' | 'assignment';
}

export interface VersusMatch {
  id: string;
  players: {
    [uid: string]: {
      name: string;
      avatar: string;
      score: number;
      joined: boolean;
    };
  };
  status: 'waiting' | 'playing' | 'finished';
  winner?: string;
  createdAt: any;
 }

export type AuthMode = 'login' | 'register';
