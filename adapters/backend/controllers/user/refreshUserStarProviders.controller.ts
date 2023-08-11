import type { RefreshUserStarProvidersUseCase } from '@fishprovider/application';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class RefreshUserStarProvidersController {
  refreshUserStarProvidersUseCase: RefreshUserStarProvidersUseCase;

  constructor(
    refreshUserStarProvidersUseCase: RefreshUserStarProvidersUseCase,
  ) {
    this.refreshUserStarProvidersUseCase = refreshUserStarProvidersUseCase;
  }

  async run(
    { userSession }: ApiHandlerRequest,
  ): ApiHandlerResponse<boolean> {
    requireLogin(userSession);

    const result = await this.refreshUserStarProvidersUseCase.run({
      user: userSession,
    });
    return { result };
  }
}
