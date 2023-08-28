import { Account } from '@fishprovider/core-new';
import { z } from 'zod';

import { getAccountService } from '~controllers/container';
import { ApiHandler } from '~types/ApiHandler.model';
import { requireLogin } from '~utils/apiHandler';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  requireLogin(userSession);

  const params = z.object({
    accountId: z.string(),
    memberId: z.string().optional(),
  }).strict()
    .parse(data);

  const result = await getAccountService().getAccount(params, userSession);
  return { result };
};

export default handler;
