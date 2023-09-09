import { serviceContextDefault, userRepoDefault } from '.';

export const userServiceBaseParams = {
  filter: {},
  payload: {},
  options: {},
  repositories: {
    user: userRepoDefault,
  },
  context: serviceContextDefault,
};
