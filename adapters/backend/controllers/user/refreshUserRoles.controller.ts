import type { RefreshUserRolesUseCase } from '@fishprovider/application-rules';
import _ from 'lodash';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class RefreshUserRolesController {
  refreshUserRolesUseCase: RefreshUserRolesUseCase;

  constructor(
    refreshUserRolesUseCase: RefreshUserRolesUseCase,
  ) {
    this.refreshUserRolesUseCase = refreshUserRolesUseCase;
  }

  async run(
    { userSession }: ApiHandlerRequest,
  ): ApiHandlerResponse<boolean> {
    requireLogin(userSession);

    const result = await this.refreshUserRolesUseCase.run({
      user: userSession,
    });
    return { result };
  }
}
