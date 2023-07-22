import type { GetAccountUseCase, JoinAccountUseCase } from '@fishprovider/application-rules';
import _ from 'lodash';

export const getAccountController = (
  getAccountUseCase: GetAccountUseCase,
) => getAccountUseCase;

export const joinAccountController = (
  joinAccountUseCase: JoinAccountUseCase,
) => joinAccountUseCase;
