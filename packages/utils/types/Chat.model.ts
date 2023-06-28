type ChatType = 'text' | 'image' | 'video' | 'audio';
type ChatStatus = 'waiting' | 'sent' | 'received' | 'read';

interface Chat {
  _id: string;
  threadId: string;

  type: ChatType;
  text?: string;

  status: ChatStatus

  userId: string;
  userName: string;
  userPicture?: string;

  updatedAt?: Date;
  createdAt: Date;
}

export type {
  Chat,
  ChatStatus,
  ChatType,
};
