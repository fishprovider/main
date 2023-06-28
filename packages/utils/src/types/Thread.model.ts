import type { Chat } from './Chat.model';

interface Thread {
  _id: string;
  name: string;

  viewType: string,
  members?: any[],

  userId: string;
  userName: string;
  userPicture?: string;

  updatedAt?: Date;
  createdAt: Date;

  lastMessage?: Chat;
  lastMessages?: Chat[];

  unread?: number;
  msgCount?: number;
  recentMsgCount?: number;
}

export type {
  Thread,
};
