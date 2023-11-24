import { User } from '@fishprovider/core';
import { UserInfo } from '@fishprovider/core-frontend';

import { buildStoreObj, buildStoreSet } from '../store';

export const storeUsers = buildStoreSet<User>({}, 'users');

export const storeUserInfo = buildStoreObj<UserInfo>({}, 'userInfo');
