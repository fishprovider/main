import type { JoinAccountUseCase } from '@fishprovider/application-rules';
import _ from 'lodash';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class JoinAccountController {
  joinAccountUseCase: JoinAccountUseCase;

  constructor(
    joinAccountUseCase: JoinAccountUseCase,
  ) {
    this.joinAccountUseCase = joinAccountUseCase;
  }

  async run(
    { userSession, data }: ApiHandlerRequest,
  ): ApiHandlerResponse<boolean> {
    requireLogin(userSession);

    const payload = z.object({
      accountId: z.string().nonempty(),
    }).strict()
      .parse(data);

    const userNew = await this.joinAccountUseCase.run({
      ...payload,
      user: userSession,
    });
    const userSessionNew = {
      ...userSession,
      ...userNew,
    };
    return { result: true, userSessionNew };
  }
}
