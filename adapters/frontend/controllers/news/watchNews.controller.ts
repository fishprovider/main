import type { WatchNewsUseCase, WatchNewsUseCaseParams } from '@fishprovider/application';

export class WatchNewsController {
  watchNewsUseCase: WatchNewsUseCase;

  constructor(
    watchNewsUseCase: WatchNewsUseCase,
  ) {
    this.watchNewsUseCase = watchNewsUseCase;
  }

  run<T>(
    params: WatchNewsUseCaseParams<T>,
  ) {
    return this.watchNewsUseCase.run(params);
  }
}
