import type { Chat } from '@fishprovider/utils/dist/types/Chat.model';
import _ from 'lodash';

import { ApiConfig, apiPost } from '~libs/api';

const chatAdd = async (
  payload: {
    chat: Partial<Chat>;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Chat>('/chats/add', payload, options);
  return doc;
};

export default chatAdd;
