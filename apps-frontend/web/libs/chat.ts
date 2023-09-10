import chatAdd from '@fishprovider/cross/dist/api/chats/add';
import storeChats from '@fishprovider/cross/dist/stores/chats';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { Chat, ChatType } from '@fishprovider/utils/dist/types/Chat.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';

import { toastError } from '~ui/toast';

import { subDoc, updateDoc } from './sdb';

const MAX_CHAT_LENGTH = 200;
const CHAT_TRIM_LENGTH = 100;

const chatSend = async (
  threadId: string,
  chat: {
    type: ChatType;
    text?: string;
  },
) => {
  const user = storeUser.getState().info as User;

  const createdAt = new Date();
  const msgId = `${createdAt.getTime()}-${user.uid}`;

  const rawDoc = {
    type: chat.type,
    ...(chat.text && { text: chat.text }),

    userId: user.uid,
    userName: user.name,
    userPicture: user.picture || '',
    createdAt,
  };

  const doc: Chat = {
    ...rawDoc,
    _id: msgId,
    threadId,
    status: 'waiting',
  };

  storeChats.mergeDoc(doc); // optimistic update

  await updateDoc({
    doc: `threads/${threadId}`,
    updateData: {
      [`chats.${msgId}`]: rawDoc,
    },
  }).then(() => {
    const newDoc: Chat = {
      ...doc,
      status: 'sent',
    };
    storeChats.mergeDoc(newDoc);

    chatAdd({ chat: newDoc }).catch((err: any) => {
      toastError(err.message);
    });
  }).catch((err) => {
    storeChats.removeDoc(msgId);
    toastError(err.message);
  });
};

const trimChats = async (threadId: string, chats: Chat[]) => {
  if (chats.length > MAX_CHAT_LENGTH) {
    const trimKeys = chats.slice(0, CHAT_TRIM_LENGTH).map((chat) => chat._id);
    const deleteData: Record<string, null> = {};
    trimKeys.forEach((key) => {
      deleteData[`chats.${key}`] = null;
    });
    await updateDoc({
      doc: `threads/${threadId}`,
      updateData: deleteData,
    });
  }
};

const chatSubscribe = (threadId: string) => {
  const unsub = subDoc<{ chats: Record<string, Chat> }>({
    doc: `threads/${threadId}`,
    onSnapshot: (doc) => {
      const chats = _.sortBy(Object.keys(doc.chats || {}).map((key) => ({
        ...doc.chats[key],
        _id: key,
        threadId,
        status: 'received',
      }) as Chat), 'createdAt');

      if (!chats.length) {
        storeChats.mergeDoc({
          _id: 'no-chat',
          threadId,
          type: 'text',
          text: 'No chat yet',
          status: 'received',
          userId: '',
          userName: '',
          createdAt: new Date(),
        });
      } else {
        storeChats.mergeDocs(chats);
        trimChats(threadId, chats);
      }
    },
  });
  return unsub;
};

export {
  chatSend,
  chatSubscribe,
};
