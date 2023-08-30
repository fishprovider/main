import { serviceContextDefault, userRepoDefault } from '.';

export const userServiceBaseParams = {
  filter: {},
  payload: {},
  repositories: {
    user: userRepoDefault,
  },
  context: serviceContextDefault,
};
