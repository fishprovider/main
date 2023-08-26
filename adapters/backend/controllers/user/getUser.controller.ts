import type { GetUserUseCase } from '@fishprovider/application';
import type { User } from '@fishprovider/models';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class GetUserController {
  getUserUseCase: GetUserUseCase;

  constructor(
    getUserUseCase: GetUserUseCase,
  ) {
    this.getUserUseCase = getUserUseCase;
  }

  async run(
    { userSession }: ApiHandlerRequest,
  ): ApiHandlerResponse<Partial<User>> {
    requireLogin(userSession);

    const result = await this.getUserUseCase.run({
      userId: userSession._id,
    });
    return { result };
  }
}
