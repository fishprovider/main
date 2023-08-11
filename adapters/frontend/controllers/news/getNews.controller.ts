import type { GetNewsUseCase, GetNewsUseCaseParams } from '@fishprovider/application';

export class GetNewsController {
  getNewsUseCase: GetNewsUseCase;

  constructor(
    getNewsUseCase: GetNewsUseCase,
  ) {
    this.getNewsUseCase = getNewsUseCase;
  }

  async run(
    params: GetNewsUseCaseParams,
  ) {
    return this.getNewsUseCase.run(params);
  }
}
