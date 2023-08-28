import {
  type BaseService,
  type ServiceList, type ServiceName, type Services,
} from '../..';

export interface IContainerService extends BaseService {
  services: Services
  register: <N extends ServiceName>(
    name: N,
    ServiceClass: new (container: IContainerService, ...args: any[]) => ServiceList[N],
    ...args: any[]
  ) => void
}
