import {
  BaseError,
  type BaseService, ServiceError,
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

export const containerServiceDefault: IContainerService = {
  name: 'container',
  services: {},
  register: () => undefined,
  getService: () => {
    throw new BaseError(ServiceError.SERVICE_UNKNOWN);
  },
};
