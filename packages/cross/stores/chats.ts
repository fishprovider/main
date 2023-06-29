import type { Chat } from '@fishbot/utils/types/Chat.model';

import { buildStoreSet } from '~libs/store';

const storeChats = buildStoreSet<Chat>({}, 'chats');

export default storeChats;
