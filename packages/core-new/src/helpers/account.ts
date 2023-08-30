import {
  Account, BaseGetOptions,
  sanitizeBaseGetOptions,
} from '..';

export const sanitizeAccountBaseGetOptions = (
  options: BaseGetOptions<Account>,
) => sanitizeBaseGetOptions(
  options,
  {
    config: 0,
  },
);
