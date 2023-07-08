import type { Chat } from '@fishprovider/utils/types/Chat.model';

import { buildStoreSet } from '~libs/store';

const storeChats = buildStoreSet<Chat>({}, 'chats');

export default storeChats;
