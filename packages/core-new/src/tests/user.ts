import { serviceContextDefault, userRepoDefault } from '.';

export const userServiceBaseParams = {
  params: {},
  repositories: {
    user: userRepoDefault,
  },
  context: serviceContextDefault,
};
