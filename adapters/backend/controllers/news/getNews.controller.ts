import type { GetNewsUseCase } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import _ from 'lodash';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandlerRequest, ApiHandlerResponse } from '~types';

export class GetNewsController {
  getNewsUseCase: GetNewsUseCase;

  constructor(
    getNewsUseCase: GetNewsUseCase,
  ) {
    this.getNewsUseCase = getNewsUseCase;
  }

  async run(
    { userSession, data }: ApiHandlerRequest,
  ): ApiHandlerResponse<News[]> {
    requireLogin(userSession);

    const finalData = {
      ...data,
      today: data.today === 'true',
      upcoming: data.upcoming === 'true',
    };

    const payload = z.object({
      today: z.boolean().optional(),
      week: z.string().optional(),
      upcoming: z.boolean().optional(),
    }).strict()
      .refine((item) => item.today || item.week || item.upcoming)
      .parse(finalData);

    const result = await this.getNewsUseCase.run(payload);
    return { result };
  }
}
