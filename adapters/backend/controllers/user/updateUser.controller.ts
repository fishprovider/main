import type { UpdateUserUseCase } from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class UpdateUserController {
  updateUserUseCase: UpdateUserUseCase;

  constructor(
    updateUserUseCase: UpdateUserUseCase,
  ) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async run(
    { userSession, data }: ApiHandlerRequest,
  ): ApiHandlerResponse<boolean> {
    requireLogin(userSession);

    const payload = z.object({
      name: z.string().optional(),
      picture: z.string().optional(),
      starProviders: z.record(z.boolean()).optional(),
    }).strict()
      .parse(data);

    const result = await this.updateUserUseCase.run({
      userId: userSession._id,
      payload,
    });
    return { result };
  }
}
