import {
  BaseError,
  type IContainerService,
  ServiceError,
  type ServiceList,
  type ServiceName,
  type Services,
} from '../..';

export class ContainerService implements IContainerService {
  name = 'container';
  services: Services = {};

  register <N extends ServiceName>(
    name: N,
    ServiceClass: new(...args: any[]) => ServiceList[N],
    ...args: any[]
  ) {
    const service = new ServiceClass(...args, this);
    this.services[name] = service;
  }

  getService <N extends ServiceName>(name: N) {
    const service = this.services[name];
    if (!service) {
      throw new BaseError(ServiceError.SERVICE_UNKNOWN, name);
    }
    return service;
  }
}
