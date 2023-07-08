import { ErrorType } from '@fishprovider/utils/constants/error';
import type { Chat } from '@fishprovider/utils/types/Chat.model';
import type { Thread } from '@fishprovider/utils/types/Thread.model';
import type { User } from '@fishprovider/utils/types/User.model';

const chatAdd = async ({ data, userInfo }: {
  data: {
    chat: Chat;
  },
  userInfo: User,
}) => {
  const { chat } = data;
  if (!chat?.threadId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const thread = await Mongo.collection<Thread>('threads').findOne(
    {
      _id: chat.threadId,
      $or: [
        { viewType: 'public' },
        { userId: uid },
        { 'members.userId': uid },
      ],
    },
  );
  if (!thread) {
    return { error: ErrorType.threadNotFound };
  }

  await Mongo.collection<Chat>('chats').insertOne(chat);

  return {
    result: {
      _id: chat._id,
    },
  };
};

export default chatAdd;
