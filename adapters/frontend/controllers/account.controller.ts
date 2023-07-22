import type {
  GetAccountUseCase, GetAccountUseCaseParams, JoinAccountUseCase, JoinAccountUseCaseParams,
} from '@fishprovider/application-rules';
import _ from 'lodash';

export const getAccountController = (
  getAccountUseCase: GetAccountUseCase,
) => async (
  params: GetAccountUseCaseParams,
) => getAccountUseCase(params);

export const joinAccountController = (
  joinAccountUseCase: JoinAccountUseCase,
) => async (
  params: JoinAccountUseCaseParams,
) => joinAccountUseCase(params);
