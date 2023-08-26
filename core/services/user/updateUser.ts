import type { UpdateUserParams } from '@fishprovider/models';

import { UserService } from '.';

export const updateUser = (userService: UserService) => async (
  params: UpdateUserParams,
) => userService.userRepository.updateUser(params);
